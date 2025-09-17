'use server'

import Thread from '@/lib/models/thread.model'
import { connectToDB } from '../mongoose'
import User from '@/lib/models/user.model'
import { revalidatePath } from 'next/cache'
import Community from '../models/community.model'

interface Params {
  text: string
  author: string
  communityId: string | null
  path: string
}

export async function createThread({ text, author, communityId, path }: Params): Promise<void> {
  await connectToDB()
  const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 })

  const createdThread = await Thread.create({
    text,
    author,
    community: communityIdObject,
  })

  await User.findByIdAndUpdate(author, {
    $push: { threads: createdThread._id },
  })

  if (communityIdObject) {
    await Community.findByIdAndUpdate(communityIdObject, {
      $push: { threads: createdThread._id },
    })
  }

  revalidatePath(path)
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB()
  const skipAmount = (pageNumber - 1) * pageSize
  const posts = (await Thread.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({ path: 'author', model: User, select: '_id name image' })
    .populate({ path: 'community', model: Community, select: '_id name image' })
    .populate({
      path: 'children',
      populate: [
        { path: 'author', model: User, select: '_id name image' },
        { path: 'community', model: Community, select: '_id name image' },
        {
          path: 'children',
          model: Thread,
          populate: { path: 'author', model: User, select: '_id name image' },
        },
      ],
    })
    .lean()) as any[]

  const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } })
  const isNext = totalPostsCount > skipAmount + posts.length

  const mappedPosts = posts.map(post => ({
    ...post,
    id: post._id.toString(),
    author: post.author ? { ...post.author, id: post.author._id.toString() } : null,
    community: post.community ? { ...post.community, id: post.community._id.toString() } : null,
    children: Array.isArray(post.children)
      ? post.children.map((child: any) => ({
          ...child,
          id: child._id.toString(),
          author: child.author ? { ...child.author, id: child.author._id.toString() } : null,
          community: child.community
            ? { ...child.community, id: child.community._id.toString() }
            : null,
        }))
      : [],
  }))

  return { posts: mappedPosts, isNext }
}

export async function fetchThreadById(id: string) {
  await connectToDB()
  try {
    const thread = (await Thread.findById(id)
      .populate({ path: 'author', model: User, select: '_id name image' })
      .populate({ path: 'community', model: Community, select: '_id name image' })
      .populate({
        path: 'children',
        populate: [
          { path: 'author', model: User, select: '_id name image' },
          { path: 'community', model: Community, select: '_id name image' },
          {
            path: 'children',
            model: Thread,
            populate: { path: 'author', model: User, select: '_id name image' },
          },
        ],
      })
      .lean()) as any

    if (!thread) return null

    return {
      ...thread,
      id: thread._id.toString(),
      author: thread.author ? { ...thread.author, id: thread.author._id.toString() } : null,
      community: thread.community
        ? { ...thread.community, id: thread.community._id.toString() }
        : null,
      children: Array.isArray(thread.children)
        ? thread.children.map((child: any) => ({
            ...child,
            id: child._id.toString(),
            author: child.author ? { ...child.author, id: child.author._id.toString() } : null,
            community: child.community
              ? { ...child.community, id: child.community._id.toString() }
              : null,
          }))
        : [],
    }
  } catch (error: any) {
    console.error('Error fetching thread:', error)
    return null
  }
}

export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
): Promise<void> {
  await connectToDB()
  const originalThread = await Thread.findById(threadId)
  if (!originalThread) throw new Error('Thread not found')

  const commentThread = new Thread({ text: commentText, author: userId, parentId: threadId })
  const savedCommentThread = await commentThread.save()

  originalThread.children.push(savedCommentThread._id)
  await originalThread.save()

  revalidatePath(path)
}

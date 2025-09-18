'use server'

import { FilterQuery, SortOrder } from 'mongoose'
import Community from '@/lib/models/community.model'
import Thread from '@/lib/models/thread.model'
import User from '@/lib/models/user.model'
import { connectToDB } from '../mongoose'
import mongoose from 'mongoose'

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
  await connectToDB()
  const user = await User.findOne({ id: createdById })
  if (!user) throw new Error('User not found')
  const newCommunity = new Community({ id, name, username, image, bio, createdBy: user._id })
  const createdCommunity = await newCommunity.save()
  user.communities.push(createdCommunity._id)
  await user.save()
  return createdCommunity
}

export async function fetchCommunityDetails(id: string) {
  await connectToDB()
  const objectId = new mongoose.Types.ObjectId(id)

  const communityDetails = await Community.findOne({ _id: objectId }).populate([
    'createdBy',
    { path: 'members', model: User, select: 'name username image _id id' },
  ])

  return communityDetails
}

export async function fetchCommunityPosts(id: string) {
  await connectToDB()
  const communityPosts = await Community.findById(id).populate({
    path: 'threads',
    model: Thread,
    populate: [
      { path: 'author', model: User, select: 'name image id' },
      {
        path: 'children',
        model: Thread,
        populate: { path: 'author', model: User, select: 'image _id' },
      },
    ],
  })
  return communityPosts
}

export async function fetchCommunities({
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchString?: string
  pageNumber?: number
  pageSize?: number
  sortBy?: SortOrder
}) {
  await connectToDB()
  const skipAmount = (pageNumber - 1) * pageSize
  const regex = new RegExp(searchString, 'i')
  const query: FilterQuery<typeof Community> = {}
  if (searchString.trim() !== '')
    query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }]
  const communitiesQuery = Community.find(query)
    .sort({ createdAt: sortBy })
    .skip(skipAmount)
    .limit(pageSize)
    .populate('members')
  const totalCommunitiesCount = await Community.countDocuments(query)
  const communities = await communitiesQuery.exec()
  const isNext = totalCommunitiesCount > skipAmount + communities.length
  return { communities, isNext }
}

export async function addMemberToCommunity(communityId: string, memberId: string) {
  await connectToDB()
  const community = await Community.findOne({ id: communityId })
  if (!community) throw new Error('Community not found')
  const user = await User.findOne({ id: memberId })
  if (!user) throw new Error('User not found')
  if (community.members.includes(user._id)) throw new Error('User is already a member')
  community.members.push(user._id)
  await community.save()
  user.communities.push(community._id)
  await user.save()
  return community
}

export async function removeUserFromCommunity(userId: string, communityId: string) {
  await connectToDB()
  const userObj = await User.findOne({ id: userId }, { _id: 1 })
  const communityObj = await Community.findOne({ id: communityId }, { _id: 1 })
  if (!userObj) throw new Error('User not found')
  if (!communityObj) throw new Error('Community not found')
  await Community.updateOne({ _id: communityObj._id }, { $pull: { members: userObj._id } })
  await User.updateOne({ _id: userObj._id }, { $pull: { communities: communityObj._id } })
  return { success: true }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  await connectToDB()
  const updatedCommunity = await Community.findOneAndUpdate(
    { id: communityId },
    { name, username, image }
  )
  if (!updatedCommunity) throw new Error('Community not found')
  return updatedCommunity
}

export async function deleteCommunity(communityId: string) {
  await connectToDB()
  const deletedCommunity = await Community.findOneAndDelete({ id: communityId })
  if (!deletedCommunity) throw new Error('Community not found')
  await Thread.deleteMany({ community: communityId })
  const communityUsers = await User.find({ communities: deletedCommunity._id })
  await Promise.all(
    communityUsers.map(user => {
      user.communities.pull(deletedCommunity._id)
      return user.save()
    })
  )
  return deletedCommunity
}

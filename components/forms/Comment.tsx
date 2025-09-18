'use client'

import { z } from 'zod'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { usePathname } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoIosSend } from 'react-icons/io'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'

import { Input } from '../ui/input'
import { Button } from '../ui/button'

import { CommentValidation } from '@/lib/validation/thread'
import { addCommentToThread } from '@/lib/actions/thread.actions'
import ButtonSmall from '../ui/button-small'

interface Props {
  threadId: string
  currentUserImg: string
  currentUserId: string
}

function Comment({ threadId, currentUserImg, currentUserId }: Props) {
  const pathname = usePathname()

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)

    form.reset()
  }

  return (
    <Form {...form}>
      <form
        className="flex items-center gap-2  pt-4 pb-10 px-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3 ">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-light-1">
                <Input
                  type="text"
                  {...field}
                  placeholder="Comment..."
                  className="no-focus text-dark-2 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <ButtonSmall type="submit" className="bg-primary-500">
          <IoIosSend size={30} className="text-light-1"/>
        </ButtonSmall>
      </form>
    </Form>
  )
}

export default Comment

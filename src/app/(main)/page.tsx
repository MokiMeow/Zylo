import dynamic from 'next/dynamic';
import prisma from "@/lib/prisma";
import Post from '@/components/posts/Post';
import TrendsSidebar from '@/components/TrendsSidebar';
import ForYouFeed from './ForYouFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FollowingFeed from './FollowingFeed';

// Dynamically import PostEditor with SSR disabled
const PostEditor = dynamic(() => import("@/components/posts/editor/PostEditor"), { ssr: false });

export default function Home() {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />
        <Tabs defaultValue="for-you">
          <TabsList>
            <TabsTrigger value="for-you">For you</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for-you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">
            <FollowingFeed />
          </TabsContent>
        </Tabs>
      </div>
      <TrendsSidebar />
    </main>
  );
}

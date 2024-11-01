import { CommentsPage, PostData } from "@/lib/types";
import CommentInput from "./Commentinput";
import { useInfiniteQuery } from "@tanstack/react-query";
import kyInstance from "@/lib/ky";
import Comment from "./Comment";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

interface CommentsProps {
  post: PostData;
}

export default function Comments({ post }: CommentsProps) {

 
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["comments", post.id],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/posts/${post.id}/comments`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<CommentsPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.comments) || [];
  return (
    <div className="space-y-3">
      <CommentInput post={post} />
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          โหลดความคิดเห็นก่อนหน้า
        </Button>
      )}
      {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
      {status === "success" && !comments.length && (
        <p className="text-center text-muted-foreground">
          ยังไม่มีการแสดงความคิดเห็น
        </p>
      )}
      {status === "error" && (
        <p className="text-center text-destructive">
          เกิดข้อผิดพลาดขณะโหลดความคิดเห็น
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment comment={comment} key={comment.id} />
        ))}
      </div>
    </div>
  );
}

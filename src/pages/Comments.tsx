
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, MessageSquare } from "lucide-react";
import { commentsApi } from "@/lib/api/apiService";
import { Comment } from "@/types";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

const Comments = () => {
  const queryClient = useQueryClient();

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments"],
    queryFn: commentsApi.getAllComments,
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: commentsApi.deleteComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours} hours`;
    } else {
      return new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(date);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="animate-fade-in">
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-drooid-gray">Comments Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View and manage all user comments across posts.
        </p>
      </motion.div>

      {isLoading ? (
        <motion.div 
          className="grid gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={item}>
              <Card className="animate-pulse border border-drooid-orange/10 bg-[#1c1917] text-[#e2dcd9]">
                <CardHeader className="h-16 bg-gray-700" />
                <CardContent className="h-20 mt-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : comments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-drooid-orange/20 bg-[#1c1917] text-[#e2dcd9]">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <MessageSquare className="h-10 w-10 text-drooid-orange mb-4" />
              <p className="text-lg font-medium text-center text-gray-400">
                No comments found
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {comments.map((comment: Comment) => (
            <motion.div 
              key={comment.id} 
              variants={item}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Card className="relative transition-all duration-300 hover:shadow-lg hover:shadow-drooid-orange/20 border-drooid-orange/20 bg-[#1c1917] text-[#e2dcd9]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/lovable-uploads/f77096a1-12bd-403e-b824-e0157c717031.png" 
                        alt="User Avatar" 
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="text-[#f9918a] font-medium">{comment.authorName || "User"}</p>
                        <div className="flex items-center space-x-1 text-xs text-gray-400">
                          <span>@username</span>
                          <span>•</span>
                          <span>{formatDate(comment.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this comment? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(comment.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-[#c8c0bb] mb-3">{comment.content}</p>
                  <div className="text-xs text-[#928d89]">
                    <span>Comment on </span>
                    <span className="text-drooid-orange">{comment.postTitle || "Post"}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Comments;

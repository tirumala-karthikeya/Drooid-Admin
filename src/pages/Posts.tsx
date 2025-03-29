import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Heart, MessageSquare, Share2, Bookmark, Search } from "lucide-react";
import { postsApi } from "@/lib/api/apiService";
import { Post } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { cn } from "@/lib/utils";

const SEARCH_FIELDS = [
  { value: "all", label: "All Fields" },
  { value: "id", label: "Post ID" },
  { value: "title", label: "Title" },
  { value: "topic", label: "Topic" },
  { value: "subTopic", label: "Sub Topic" }
];

const DEBOUNCE_DELAY = 500; // 500ms delay

const Posts = () => {
  const queryClient = useQueryClient();
  const [expandedPost, setExpandedPost] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("all");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    // Skip debounce for ID searches
    if (searchField === 'id') {
      setDebouncedSearchQuery(searchQuery);
      return;
    }

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery, searchField]);

  // Search posts
  const { data: posts = [], isLoading, error } = useQuery({
    queryKey: ["posts", debouncedSearchQuery, searchField],
    queryFn: async () => {
      if (!debouncedSearchQuery) return [];
      console.log('Searching posts with:', { query: debouncedSearchQuery, field: searchField });
      const data = await postsApi.searchPosts(
        debouncedSearchQuery,
        searchField === "all" ? undefined : searchField
      );
      console.log('Search results:', data);
      return data;
    },
    enabled: !!debouncedSearchQuery
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const toggleExpandPost = (postId: number) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

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

  if (error) {
    return (
      <div className="text-red-500">
        Error loading posts: {(error as Error).message}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-drooid-gray">Posts Management</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Search and manage posts by ID, category, or keywords.
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={searchField} onValueChange={setSearchField}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Search field" />
          </SelectTrigger>
          <SelectContent>
            {SEARCH_FIELDS.map((field) => (
              <SelectItem key={field.value} value={field.value}>
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Card className="animate-pulse border border-drooid-orange/10 bg-[#1c1917] text-[#e2dcd9]">
                <CardHeader className="h-20 bg-gray-700" />
                <CardContent className="h-32 mt-4">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : !debouncedSearchQuery ? (
        <div>
          <Card className="border-drooid-orange/20 bg-[#1c1917] text-[#e2dcd9]">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <Search className="h-10 w-10 text-drooid-orange mb-4" />
              <p className="text-lg font-medium text-center text-gray-400">
                Enter a search term to find posts
              </p>
            </CardContent>
          </Card>
        </div>
      ) : posts.length === 0 ? (
        <div>
          <Card className="border-drooid-orange/20 bg-[#1c1917] text-[#e2dcd9]">
            <CardContent className="flex flex-col items-center justify-center h-40">
              <FileText className="h-10 w-10 text-drooid-orange mb-4" />
              <p className="text-lg font-medium text-center text-gray-400">
                No posts found matching your search
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: Post) => (
            <div 
              key={post.id} 
              className={cn(
                expandedPost === post.id ? "md:col-span-2 lg:col-span-3" : ""
              )}
            >
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-drooid-orange/20 border-drooid-orange/20 bg-[#1c1917] text-[#e2dcd9]">
                <CardHeader className="bg-[#1c1917]/80 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <img 
                          src="/lovable-uploads/4f1bc737-3640-4ac1-a7c7-d57c72451951.png" 
                          alt="User Avatar" 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-[#f9918a] font-medium">User Name</p>
                          <p className="text-xs text-gray-400">@username • {formatDate(post.createdAt)}</p>
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
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this post? This action
                            cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(post.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-2 pb-1">
                  {post.imageUrl && (
                    <div className="relative h-48 overflow-hidden mb-3 rounded-md">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <h3 className="text-lg font-bold mb-2 text-[#e9e3df]">{post.title}</h3>
                  
                  <div className={expandedPost === post.id ? "" : "line-clamp-3"}>
                    <p className="text-[#c8c0bb]">{post.content}</p>
                  </div>
                  
                  {post.content && post.content.length > 120 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-[#f9918a] hover:text-[#f9918a]/80 hover:bg-[#f9918a]/10"
                      onClick={() => toggleExpandPost(post.id)}
                    >
                      {expandedPost === post.id ? "Show less" : "Read more"}
                    </Button>
                  )}
                  
                  {post.categories && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className="bg-[#3b3734] text-[#e2dcd9] hover:bg-[#3b3734]/80">
                        {post.topic || post.categories}
                      </Badge>
                      {post.subTopic && (
                        <Badge className="bg-[#3b3734] text-[#e2dcd9] hover:bg-[#3b3734]/80">
                          {post.subTopic}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between items-center py-3 px-4 border-t border-[#3b3734]">
                  <div className="flex gap-4">
                    <Button variant="ghost" size="sm" className="text-[#e2dcd9] gap-1 p-0 h-auto">
                      <Heart className="h-4 w-4 text-[#f9918a]" />
                      <span>{post.viewsCount || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#e2dcd9] gap-1 p-0 h-auto">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.commentsCount || 0}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-[#e2dcd9] gap-1 p-0 h-auto">
                      <Share2 className="h-4 w-4" />
                      <span>0</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-[#e2dcd9] p-0 h-auto">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;

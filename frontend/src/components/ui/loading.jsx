import { Skeleton } from "@/components/ui/skeleton";

const LoadingPage = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Skeleton className="h-8 w-48" />
      <p className="text-muted-foreground">{message}</p>
      <div className="space-y-2">
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
};

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-muted-foreground">{message}</p>
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-64" />
    </div>
  );
};


export { LoadingPage, LoadingSpinner };

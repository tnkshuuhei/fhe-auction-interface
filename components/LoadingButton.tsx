import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Param {
  message: string;
}

export default function LoadingButton({ message }: Param) {
  return (
    <Button disabled className="w-full mt-4">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {message}
    </Button>
  );
}

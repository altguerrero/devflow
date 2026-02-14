import Link from "next/link";
import ROUTES from "@/constants/routes";
import { cn, getDeviconClass } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface TagCardProps {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
}

const TagCard = ({ _id, name, questions, showCount = false, compact = false }: TagCardProps) => {
  return (
    <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
      <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
        <div className="flex-center space-x-2">
          <i className={cn(getDeviconClass(name), compact ? "text-sm" : "text-base")} aria-hidden="true" />
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </Link>
  );
};

export default TagCard;

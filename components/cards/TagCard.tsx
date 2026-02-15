import Link from "next/link";

import ROUTES from "@/constants/routes";
import { cn, getDeviconClass } from "@/lib/utils";
import { Badge } from "../ui/badge";
import Image from "next/image";

interface Props {
  _id: string;
  name: string;
  questions?: number;
  showCount?: boolean;
  compact?: boolean;
  remove?: boolean;
  isButton?: boolean;
  handleRemove?: () => void;
}

const TagContent = ({
  name,
  compact,
  remove,
  onRemove,
}: Pick<Props, "name" | "compact" | "remove"> & { onRemove?: () => void }) => (
  <Badge className="subtle-medium background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase">
    <div className="flex-center space-x-2">
      <i className={cn(getDeviconClass(name), compact ? "text-sm" : "text-base")} aria-hidden="true" />
      <span>{name}</span>
      {remove && onRemove && (
        <button type="button" onClick={onRemove} aria-label={`Remove tag ${name}`} className="ml-1 cursor-pointer">
          <Image
            src="/icons/close.svg"
            width={12}
            height={12}
            alt="close icon"
            className="object-contain invert-0 dark:invert"
          />
        </button>
      )}
    </div>
  </Badge>
);

const TagCard = ({
  _id,
  name,
  questions,
  showCount = false,
  compact = false,
  remove,
  isButton,
  handleRemove,
}: Props) => {
  if (isButton) {
    return (
      <div className="flex justify-between gap-2">
        <TagContent name={name} compact={compact} remove={remove} onRemove={handleRemove} />
      </div>
    );
  }

  return (
    <Link href={ROUTES.TAG(_id)} className="flex justify-between gap-2">
      <TagContent name={name} compact={compact} remove={remove} />
      {showCount && <p className="small-medium text-dark500_light700">{questions}</p>}
    </Link>
  );
};

export default TagCard;

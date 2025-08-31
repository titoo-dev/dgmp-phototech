'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  totalPages: number;
  currentPage: number;
  onChange: (page: number) => void;
};

export default function GalleryPagination({ totalPages, currentPage, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationPrevious
          href="#"
          size="default"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (currentPage > 1) onChange(currentPage - 1);
          }}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : undefined}
        />

        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i + 1}
              size="icon"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                onChange(i + 1);
              }}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationNext
          href="#"
          size="default"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            if (currentPage < totalPages) onChange(currentPage + 1);
          }}
          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : undefined}
        />
      </PaginationContent>
    </Pagination>
  );
}

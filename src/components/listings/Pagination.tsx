import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
        <ChevronLeftIcon className="h-4 w-4" aria-hidden />
        Previous
      </Button>
      <span className="text-13 text-text-secondary" aria-current="page">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
        Next
        <ChevronRightIcon className="h-4 w-4" aria-hidden />
      </Button>
    </nav>
  );
}

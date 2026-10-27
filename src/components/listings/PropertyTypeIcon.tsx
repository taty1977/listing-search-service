import { BuildingOffice2Icon, BuildingOfficeIcon, HomeIcon, HomeModernIcon, MapIcon } from '@heroicons/react/24/outline';
import type { ComponentType, SVGProps } from 'react';
import type { PropertyType } from '@/lib/listings/types';

const ICONS: Record<PropertyType, ComponentType<SVGProps<SVGSVGElement>>> = {
  single_family: HomeIcon,
  condo: BuildingOfficeIcon,
  townhouse: HomeModernIcon,
  multi_family: BuildingOffice2Icon,
  land: MapIcon,
};

export function PropertyTypeIcon({ type, className }: { type: PropertyType; className?: string }) {
  const Icon = ICONS[type];
  return <Icon className={className} aria-hidden />;
}

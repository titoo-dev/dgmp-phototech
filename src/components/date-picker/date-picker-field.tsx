'use client';
import * as React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerFieldProps {
	id: string;
	name: string;
	label: string;
	placeholder?: string;
	error?: string;
	required?: boolean;
	disabled?: boolean;
	className?: string;
	defaultValue?: Date;
	onChange?: (date: Date | undefined) => void;
}

export default function DatePickerField({
	id,
	name,
	label,
	placeholder = 'Sélectionner une date',
	error,
	required = false,
	disabled = false,
	className,
	defaultValue,
	onChange,
}: DatePickerFieldProps) {
	const [date, setDate] = React.useState<Date | undefined>(defaultValue);
	const [open, setOpen] = React.useState(false);

	const handleSelect = (newDate: Date | undefined) => {
		setDate(newDate);
		setOpen(false);
		onChange?.(newDate);
	};

	return (
		<div className={cn('space-y-2', className)}>
			<Label htmlFor={id} className="text-sm font-medium text-foreground">
				{label}
				{required && <span className="text-destructive ml-1">*</span>}
			</Label>

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						id={id}
						variant="outline"
						className={cn(
							'w-full h-12 justify-start text-left font-normal bg-background border-input hover:bg-accent hover:text-accent-foreground',
							!date && 'text-muted-foreground',
							error && 'border-destructive',
							disabled && 'opacity-50 cursor-not-allowed'
						)}
						disabled={disabled}
						aria-invalid={!!error}
						aria-describedby={error ? `${id}-error` : undefined}
					>
						<CalendarIcon className="mr-3 h-4 w-4 text-muted-foreground" />
						{date ? (
							format(date, 'PPP', { locale: fr })
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>

				<PopoverContent
					className="w-auto p-0 bg-popover"
					align="start"
					sideOffset={4}
				>
					<Calendar
						mode="single"
						selected={date}
						onSelect={handleSelect}
						initialFocus
						locale={fr}
						disabled={disabled}
						className="rounded-md"
					/>
				</PopoverContent>
			</Popover>

			{/* Hidden input for form submission */}
			<input
				type="hidden"
				name={name}
				value={date ? format(date, 'yyyy-MM-dd') : ''}
			/>

			{error && (
				<p
					id={`${id}-error`}
					className="text-sm text-destructive flex items-center gap-1"
					role="alert"
				>
					<AlertCircle className="w-4 h-4" />
					{error}
				</p>
			)}
		</div>
	);
}

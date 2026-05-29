import { FileText } from 'lucide-react';

interface Props {
    title: string;
    description?: string;
}

export function EmptyState({ title, description }: Props) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
                <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-medium mb-1">{title}</h3>
            {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
        </div>
    );
}
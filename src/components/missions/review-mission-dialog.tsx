'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquare, Loader2 } from 'lucide-react';
import { reviewMissionAction } from '@/actions/mission/review-mission-action';
import { toast } from 'sonner';

interface ReviewMissionDialogProps {
  missionId: string;
  missionNumber: string;
  onReviewSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ReviewMissionDialog({ 
  missionId, 
  missionNumber, 
  onReviewSuccess,
  trigger 
}: ReviewMissionDialogProps) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Erreur', {
        description: 'Le commentaire de révision est requis',
        duration: 3000,
      });
      return;
    }

    startTransition(async () => {
      const result = await reviewMissionAction(missionId, comment.trim());
      
      if (result.success) {
        toast.success('Mission renvoyée', {
          description: result.message,
          duration: 3000,
        });
        setOpen(false);
        setComment('');
        onReviewSuccess?.();
      } else {
        toast.error('Erreur', {
          description: result.errors?._form?.[0] || 'Impossible de renvoyer la mission pour révision',
          duration: 5000,
        });
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setComment('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="h-7 px-3 text-xs">
            <MessageSquare className="w-3 h-3 mr-1" />
            Réviser
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Réviser la mission</DialogTitle>
            <DialogDescription>
              Mission #{missionNumber} - Ajoutez vos commentaires de révision
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="comment">Commentaires de révision *</Label>
              <Textarea
                id="comment"
                placeholder="Décrivez les modifications nécessaires..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[120px] resize-none"
                maxLength={1000}
                disabled={isPending}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Les commentaires seront envoyés par email au chef d'équipe</span>
                <span>{comment.length}/1000</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={isPending || !comment.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Renvoyer pour révision
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

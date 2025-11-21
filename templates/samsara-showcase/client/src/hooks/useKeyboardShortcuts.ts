import { useEffect } from 'react';

interface KeyboardShortcutActions {
  onGenerate?: () => void;
  onReset?: () => void;
  onNextFractal?: () => void;
  onPrevFractal?: () => void;
  onToggleFavorite?: () => void;
  onDownload?: () => void;
}

export function useKeyboardShortcuts(actions: KeyboardShortcutActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.code) {
        case 'Space':
          if (e.shiftKey) return; // Allow shift+space for browser search
          e.preventDefault();
          actions.onGenerate?.();
          break;
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) return; // Allow Ctrl+R for refresh
          e.preventDefault();
          actions.onReset?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          actions.onNextFractal?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          actions.onPrevFractal?.();
          break;
        case 'KeyF':
          if (e.ctrlKey || e.metaKey) return; // Allow Ctrl+F for find
          e.preventDefault();
          actions.onToggleFavorite?.();
          break;
        case 'KeyD':
          if (e.ctrlKey || e.metaKey) return; // Allow Ctrl+D for bookmark
          e.preventDefault();
          actions.onDownload?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}


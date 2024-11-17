'use client';

import { createContext, useContext, useState } from 'react';
import { ArchonShardBonusDialog } from './ArchonShardBonusDialog';
import type { ShardBuff, ShardColor } from '@/types/ArchonShard';

interface DialogState {
  isOpen: boolean;
  color: ShardColor | null;
  tauforged: boolean;
  onSelect: ((buff: ShardBuff) => void) | null;
}

interface DialogActions {
  openDialog: (params: { color: ShardColor; tauforged: boolean; onSelect: (buff: ShardBuff) => void }) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogActions | null>(null);

export function useArchonShardBonusDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useArchonShardBonusDialog must be used within ArchonShardBonusDialogProvider');
  }
  return context;
}

export function ArchonShardBonusDialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    color: null,
    tauforged: false,
    onSelect: null,
  });

  const openDialog: DialogActions['openDialog'] = ({ color, tauforged, onSelect }) => {
    setDialogState({
      isOpen: true,
      color,
      tauforged,
      onSelect,
    });
  };

  const closeDialog = () => {
    setDialogState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <DialogContext.Provider value={{ openDialog, closeDialog }}>
      {children}
      {dialogState.color && (
        <ArchonShardBonusDialog
          isOpen={dialogState.isOpen}
          onClose={closeDialog}
          onSelect={(buff) => {
            dialogState.onSelect?.(buff);
            closeDialog();
          }}
          color={dialogState.color}
          tauforged={dialogState.tauforged}
        />
      )}
    </DialogContext.Provider>
  );
}

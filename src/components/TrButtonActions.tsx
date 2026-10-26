interface TrButtonActionsProps {
  editLabel: string;
  deleteLabel: string;
  onDeleteClick: () => void;
  onUpdateClick: () => void;
  canDelete?: boolean;
}

export function TrButtonActions({editLabel="editar",deleteLabel="apagar",onDeleteClick,onUpdateClick,canDelete=true}:TrButtonActionsProps){

    return(
                  <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={onUpdateClick}
                    className="rounded-md border border-line px-2.5 py-1 text-xs text-warn hover:bg-warn/10 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {editLabel}
                  </button>
                  {
                    canDelete &&
                    <button
                      type="button"
                      onClick={onDeleteClick}
                      className="rounded-md border border-line px-2.5 py-1 text-xs text-fail hover:bg-fail/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deleteLabel}
                    </button>
                  }
                  </div>
    )
}
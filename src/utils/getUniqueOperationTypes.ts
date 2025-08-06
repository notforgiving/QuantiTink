import { TOperation } from "api/features/accounts/accountsTypes";

export const getUniqueOperationTypes = (operations: TOperation[]): string[] => {
  const unique = new Set<string>();
  operations.forEach(op => {
    if (op.type) {
      unique.add(op.type);
    }
  });
  return Array.from(unique);
};
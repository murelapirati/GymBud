import { LibraryFolder, Recipe, WorkoutTemplate } from '../types';

export type FolderDeleteMode = 'delete_contents' | 'move_contents_to_root';

export interface FolderDeleteResult {
  folders: LibraryFolder[];
  templates: WorkoutTemplate[];
  recipes: Recipe[];
  affectedItemCount: number;
  affectedFolderCount: number;
}

export function deleteLibraryFolder(
  folderId: string,
  mode: FolderDeleteMode,
  folders: LibraryFolder[],
  templates: WorkoutTemplate[],
  recipes: Recipe[],
): FolderDeleteResult {
  const folderIds = new Set(
    folders
      .filter(folder => folder.id === folderId || folder.parentId === folderId)
      .map(folder => folder.id),
  );
  const targetFolder = folders.find(folder => folder.id === folderId);

  if (!targetFolder || targetFolder.isSystem) {
    return {
      folders,
      templates,
      recipes,
      affectedItemCount: 0,
      affectedFolderCount: 0,
    };
  }

  const affectedTemplates = templates.filter(
    template => template.folderId && folderIds.has(template.folderId),
  );
  const affectedRecipes = recipes.filter(
    recipe => recipe.folderId && folderIds.has(recipe.folderId),
  );
  const updateItemFolder = <T extends { folderId?: string }>(items: T[]) =>
    mode === 'delete_contents'
      ? items.filter(item => !item.folderId || !folderIds.has(item.folderId))
      : items.map(item =>
          item.folderId && folderIds.has(item.folderId)
            ? { ...item, folderId: undefined }
            : item,
        );

  return {
    folders: folders.filter(folder => !folderIds.has(folder.id)),
    templates: updateItemFolder(templates),
    recipes: updateItemFolder(recipes),
    affectedItemCount: affectedTemplates.length + affectedRecipes.length,
    affectedFolderCount: folderIds.size,
  };
}

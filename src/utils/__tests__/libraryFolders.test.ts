import {
  deleteLibraryFolder,
  FolderDeleteMode,
} from '../libraryFolders';
import { LibraryFolder, Recipe, WorkoutTemplate } from '../../types';

const folder: LibraryFolder = {
  id: 'templates-folder',
  name: 'Push',
  type: 'templates',
  createdAt: 1,
};

const childFolder: LibraryFolder = {
  id: 'templates-child',
  name: 'Heavy',
  type: 'templates',
  createdAt: 2,
  parentId: folder.id,
};

const templates: WorkoutTemplate[] = [
  {
    id: 'template-1',
    name: 'Push',
    workoutType: 'strength',
    createdAt: 1,
    folderId: folder.id,
    exercises: [],
  },
  {
    id: 'template-2',
    name: 'Heavy Push',
    workoutType: 'strength',
    createdAt: 2,
    folderId: childFolder.id,
    exercises: [],
  },
  {
    id: 'default-template',
    name: 'Default',
    workoutType: 'strength',
    createdAt: 0,
    folderId: 'system-default-workouts',
    exercises: [],
  },
];

const recipes: Recipe[] = [];

function deleteFolder(mode: FolderDeleteMode) {
  return deleteLibraryFolder(
    folder.id,
    mode,
    [folder, childFolder],
    templates,
    recipes,
  );
}

describe('deleteLibraryFolder', () => {
  it('deletes a non-empty folder and all of its contents', () => {
    const result = deleteFolder('delete_contents');

    expect(result.folders).toEqual([]);
    expect(result.templates).toEqual([templates[2]]);
    expect(result.affectedItemCount).toBe(2);
  });

  it('moves contents to root without losing default templates', () => {
    const result = deleteFolder('move_contents_to_root');

    expect(result.folders).toEqual([]);
    expect(result.templates).toEqual([
      { ...templates[0], folderId: undefined },
      { ...templates[1], folderId: undefined },
      templates[2],
    ]);
    expect(result.affectedItemCount).toBe(2);
  });
});

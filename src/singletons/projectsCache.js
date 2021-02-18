import NodeCache from 'node-cache';

//_______________________________________________________________________
export const projectIds = new NodeCache({
  stdTTL: 0,
  checkperiod: 60,
});
//_______________________________________________________________________
export const checkProject = (project) => {
  const projectExists = projectIds.get(project);
  if (projectExists) {
    return projectExists;
  } else {
    throw Error('project does not Exists');
  }
};

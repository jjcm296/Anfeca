
module.exports.checkOwnership = (Model, paramIdName = 'id', resourceName = 'Resource') => {
  return async (req, res, next) => {
      try {
          const resourceId = req.params[paramIdName];
          const guardianId = req.user.guardianId;

          const resource = await Model.findById(resourceId);
          if (!resource) {
              return res.status(404).json({ error: `${resourceName} not found` });
          }

          if (!resource.guardianId.equals(guardianId)) {
              return res.status(403).json({ error: `Not authorized to access this ${resourceName}` });
          }

          req.resource = resource;
          next();

      } catch (error) {
          res.status(400).json({ error: error.message });
      }

  }
};
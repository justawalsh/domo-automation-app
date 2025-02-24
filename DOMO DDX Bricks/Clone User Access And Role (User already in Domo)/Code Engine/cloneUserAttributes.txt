const codeengine = require('codeengine');

class Helpers {
  static async handleRequest(method, url, body = null) {
    try {
      const response = await codeengine.sendRequest(method, url, body);
      return response;
    } catch (error) {
      console.error(`Error with ${method} request to ${url}:`, error);
      throw error;
    }
  }
}
/**
 * This will clone a users role and groups from one uers to another.
 *
 * @param {text} param1 - origional user to be cloned
 * @param {text} param2 - user you are cloning to
 * @returns {boolean} - true if successful
 */

async function cloneUserAttributes(param1, param2) {
  try {
    // Fetch primary user details to get role ID
    const primaryUserDetails = await Helpers.handleRequest('get', `/api/content/v3/users/${param1}?includeDetails=true`);
    if (!primaryUserDetails || !primaryUserDetails.roleId) {
      throw new Error(`Unable to fetch role ID for primary user ${param1}`);
    }
    const primaryUserRoleId = primaryUserDetails.roleId;
    console.log('Primary User Role ID:', primaryUserRoleId);

    // Fetch groups of the primary user
    const primaryUserGroupsResponse = await Helpers.handleRequest(
      'get',
      `/api/content/v2/groups/grouplist?ascending=true&includeDeleted=false&includeSupport=false&limit=100&members=${param1}&offset=0&sort=name`
    );

    if (!Array.isArray(primaryUserGroupsResponse)) {
      throw new Error(`Invalid group response for primary user ${param1}`);
    }

    console.log('Primary User Groups Response:', primaryUserGroupsResponse);

    // Extract groups from the response
    const primaryUserGroups = primaryUserGroupsResponse.map(group => ({
      groupId: group.groupId,
      name: group.name,
    }));

    console.log('Extracted Primary User Groups:', primaryUserGroups);

    // Update secondary user's role to match primary user's role
    await Helpers.handleRequest('put', `/api/authorization/v1/roles/${primaryUserRoleId}/users`, [param2]);
    console.log(`Role cloned from user ${param1} to user ${param2}`);

    // Add secondary user to the same groups as primary user
    for (const group of primaryUserGroups) {
      try {
        console.log(`Adding user ${param2} to group ${group.groupId} (${group.name})`);
        await Helpers.handleRequest('put', `/api/content/v2/groups/${group.groupId}/user`, [param2]);
      } catch (error) {
        console.error(`Failed to add user ${param2} to group ${group.groupId}:`, error);
      }
    }

    console.log(`Successfully cloned role and groups from user ${param1} to user ${param2}`);
  } catch (error) {
    console.error('Error cloning user attributes:', error);
    throw error;
  }
}

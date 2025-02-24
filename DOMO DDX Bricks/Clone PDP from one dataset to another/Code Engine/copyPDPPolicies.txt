const codeengine = require('codeengine');

/**
 * Copy PDP policies from one dataset to another, ensuring only new policies are added.
 *
 * @param {string} param1 - ID of the source dataset
 * @param {string} param2 - ID of the target dataset
 * @returns {Promise<void>}
 */
async function copyPDPPolicies(param1, param2) {
  const fetchSourcePoliciesUrl = `/api/query/v1/data-control/${param1}/filter-groups?options=load_associations,include_open_policy,load_filters,sort`;
  const fetchTargetPoliciesUrl = `/api/query/v1/data-control/${param2}/filter-groups?options=load_associations,include_open_policy,load_filters,sort`;
  const applyPoliciesUrl = `/api/query/v1/data-control/${param2}/filter-groups?options=load_associations,include_open_policy,load_filters,sort`;

  try {
    console.log('Fetching source policies...');
    const sourcePoliciesResponse = await codeengine.sendRequest('GET', fetchSourcePoliciesUrl);
    console.log('Source Policies Response:', JSON.stringify(sourcePoliciesResponse, null, 2));

    const sourcePolicyNames = new Set(
      (sourcePoliciesResponse || [])
        .filter(policy => policy.name) // Ensure the policy has a name
        .map(policy => policy.name.toLowerCase())
    );
    console.log(`Source dataset has ${sourcePolicyNames.size} policies.`);

    console.log('Fetching target policies...');
    const targetPoliciesResponse = await codeengine.sendRequest('GET', fetchTargetPoliciesUrl);
    console.log('Target Policies Response:', JSON.stringify(targetPoliciesResponse, null, 2));

    const targetPolicyNames = new Set(
      (targetPoliciesResponse || [])
        .filter(policy => policy.name) // Ensure the policy has a name
        .map(policy => policy.name.toLowerCase())
    );
    console.log(`Target dataset has ${targetPolicyNames.size} policies.`);

    // Determine policies to add
    const policiesToAdd = (sourcePoliciesResponse || []).filter(
      policy =>
        policy.name &&
        !targetPolicyNames.has(policy.name.toLowerCase())
    );

    console.log(`Policies to add: ${policiesToAdd.length}`);
    if (policiesToAdd.length === 0) {
      console.log('No new PDP policies to copy.');
      return;
    }

    // Apply new policies to the target dataset
    for (const policy of policiesToAdd) {
      try {
        const newPolicy = {
          ...policy,
          datasetId: param2,
        };
        console.log(`Adding policy: ${policy.name}`);
        await codeengine.sendRequest('POST', applyPoliciesUrl, newPolicy);
      } catch (error) {
        console.error(`Error adding policy "${policy.name}":`, error.message || error);
      }
    }

    console.log('PDP policies copied successfully.');
  } catch (error) {
    console.error('Error copying PDP policies:', error.message || error);
    throw error;
  }
}
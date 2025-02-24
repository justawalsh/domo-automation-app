const codeengine = require('codeengine');

/**
 * Changes the card title, removing the prefix "Duplicate of " if present
 *
 * @param {text} param1 - dashboard to be cleaned up
 * @returns {boolean} - true if successful
 */

async function updateAllCardTitles(param1) {
  const fetchPageUrl = `api/content/v1/pages/${param1}/cards`; // Endpoint to fetch all cards on a page

  try {
    // Fetch all card IDs from the page
    const pageResponse = await codeengine.sendRequest('GET', fetchPageUrl);
    if (!pageResponse || pageResponse.length === 0) {
      throw new Error('No cards found on the page');
    }

    const cardIds = pageResponse.map(card => card.id);

    for (const cardId of cardIds) {
      const fetchUrl = `api/content/v1/cards?urns=${cardId}&parts=metadata,metadataOverrides,problems,properties,certification,datasources,dateInfo,domoapp,drillPath,drillPathURNs,library,masonData,owner,owners,problems,properties,slicers&includeFiltered=true`; // Endpoint to fetch card details
      const updateUrl = `/api/content/v1/cards/${cardId}/title`; // Endpoint to update card title

      try {
        // Fetch the current card details
        const response = await codeengine.sendRequest('GET', fetchUrl);
        if (!response || response.length === 0) {
          throw new Error(`No card data found for card ID: ${cardId}`);
        }

        const currentTitle = response[0].title;
        if (!currentTitle) {
          throw new Error(`Title not found in card data for card ID: ${cardId}`);
        }

        // Remove "Duplicate of " from the title
        const newTitle = currentTitle.replace(/^Duplicate of /, '');

        // Update the card with the new title
        const payload = { title: newTitle };
        await codeengine.sendRequest('PUT', updateUrl, payload);

      } catch (error) {
        console.error(`Error updating card title for card ID: ${cardId}`, error); // Log the error for debugging
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating card titles:', error); // Log the error for debugging
    throw error;
  }
}

/**
 * Changes the card title, removing the prefix "Duplicate of " if present and also update datasource on card
 *
 * @param {text} param1 - dashboard to be cleaned up
 * @param {text} param2 dataset id for each card on dashboard being cleaned up
 * @returns {boolean} - true if successful
 */

async function updateAllCardTitlesAndDatasources(param1, param2) {
  const fetchPageUrl = `api/content/v1/pages/${param1}/cards`; // Endpoint to fetch all cards on a page

  try {
    // Fetch all card IDs from the page
    const pageResponse = await codeengine.sendRequest('GET', fetchPageUrl);
    if (!pageResponse || pageResponse.length === 0) {
      throw new Error('No cards found on the page');
    }

    const cardIds = pageResponse.map(card => card.id);

    const fetchUrl = cardId => `api/content/v1/cards?urns=${cardId}&parts=metadata,metadataOverrides,problems,properties,certification,datasources,dateInfo,domoapp,drillPath,drillPathURNs,library,masonData,owner,owners,slicers&includeFiltered=true`; // Endpoint to fetch card details
    const updateTitleUrl = cardId => `/api/content/v1/cards/${cardId}/title`; // Endpoint to update card title
    const updateDatasourceUrl = cardId => `/api/content/v1/cards/${cardId}/datasource/${param2}`; // Endpoint to update card datasource

    // Fetch all card details concurrently
    const cardDetailsPromises = cardIds.map(cardId => codeengine.sendRequest('GET', fetchUrl(cardId)).then(response => ({ cardId, response })).catch(error => ({ cardId, error })));
    const cardDetailsResults = await Promise.all(cardDetailsPromises);

    for (const { cardId, response, error } of cardDetailsResults) {
      if (error) {
        console.error(`Error fetching card details for card ID: ${cardId}`, error);
        continue;
      }

      if (!response || response.length === 0) {
        console.error(`No card data found for card ID: ${cardId}`);
        continue;
      }

      const { title: currentTitle } = response[0];
      if (!currentTitle) {
        console.error(`Title not found in card data for card ID: ${cardId}`);
        continue;
      }

      // Remove "Duplicate of " from the title
      const newTitle = currentTitle.replace(/^Duplicate of /, '');

      // Update the card title
      try {
        const titlePayload = { title: newTitle };
        await codeengine.sendRequest('PUT', updateTitleUrl(cardId), titlePayload);
      } catch (updateTitleError) {
        console.error(`Error updating card title for card ID: ${cardId}`, updateTitleError);
      }

      // Update the card datasource
      try {
        const datasourcePayload = { datasourceId: param2 }; // Assuming this is the correct payload structure
        await codeengine.sendRequest('PUT', updateDatasourceUrl(cardId), datasourcePayload);
      } catch (updateDatasourceError) {
        console.error(`Error updating datasource for card ID: ${cardId}`, updateDatasourceError);
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating card titles and datasources:', error); // Log the error for debugging
    throw error;
  }
}
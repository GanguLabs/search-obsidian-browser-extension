import { getPossibleElementByQuerySelector } from '../../utils';
import { SearchEngine, config } from './search-engine-config';
import { getUserConfig } from '../../config';
import { OmnisearchCard } from './OmnisearchCard';
import { createRoot } from 'react-dom/client';
import React from 'react';

import './style.css'

const siteRegex = new RegExp(Object.keys(config).join('|'));
const siteName = window.location.hostname.match(siteRegex)![0];
const siteConfig = config[siteName];

async function mount(query: string, siteConfig: SearchEngine) {
  // const googleResultsDiv = document.getElementById("search")?.parentElement;
  const container = document.createElement('div');
  container.className = 'omnisearch-container';

  const userConfig = await getUserConfig();

  const siderbarContainer = getPossibleElementByQuerySelector(
    siteConfig.sidebarContainerQuery
  );
  if (siderbarContainer) {
    siderbarContainer.prepend(container);
  } else {
    container.classList.add('sidebar-free');
    const appendContainer = getPossibleElementByQuerySelector(
      siteConfig.appendContainerQuery
    );
    if (appendContainer) {
      appendContainer.appendChild(container);
    }
  }

  createRoot(container as HTMLElement).render(
    <OmnisearchCard query={query} userConfig={userConfig} />
  );
}

async function run() {
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(
    siteConfig.inputQuery
  );
  if (searchInput && searchInput.value) {
    mount(searchInput.value, siteConfig);
  }
}

run();

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run);
}

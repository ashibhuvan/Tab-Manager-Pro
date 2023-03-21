// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const tabs = await chrome.tabs.query({
  url: [
    'https://*/*'
  ]
});

const collator = new Intl.Collator();
tabs.sort((a, b) => collator.compare(a.url, b.url));

const template = document.getElementById('li_template');
const customTemplate = document.getElementById('li_template_2');

const elements = new Set();
const customElements = new Set();
for (const tab of tabs) {
  const element = template.content.firstElementChild.cloneNode(true);

  const title = tab.title.split('-')[0].trim();
  const pathname = tab.url;

  element.querySelector('.title').textContent = title;
  element.querySelector('.pathname').textContent = pathname;
  element.querySelector('a').addEventListener('click', async () => {
    // need to focus window as well as the active tab
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
  });

  elements.add(element);
}
document.querySelector('ul').append(...elements);

const button = document.querySelector('#groupBtn');
button.addEventListener('click', async () => {
  const tabIds = tabs.map(({ id }) => id);
  const group = await chrome.tabs.group({ tabIds });
  await chrome.tabGroups.update(group, { title: 'DOCS' });
});

const sortBtn = document.querySelector('#sortBtn');
sortBtn.addEventListener('click', async () => {
    const tabIds = tabs.map(({ id }) => id);
    await chrome.tabs.move(tabIds, {index: 0});
});

const addTabBtn = document.querySelector('#submitCustomTab');
addTabBtn.addEventListener('click', async () => {
  const element = customTemplate.content.firstElementChild.cloneNode(true);
  const url = document.querySelector("#customTab").value;
  console.log("url is" + url);
 

  element.querySelector('.customTitle').textContent = url;
  element.querySelector('.customPathname').textContent = url;
  //element.querySelector('a').addEventListener('click', async () => {
    // need to focus window as well as the active tab
   // await chrome.tabs.update(tab.id, { active: true });
    //await chrome.windows.update(tab.windowId, { focused: true });
  //});
  elements.add(element);

 
  document.querySelector('.customTabsUL').append(element);

    
});
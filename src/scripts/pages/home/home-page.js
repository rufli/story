import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoryListEmptyTemplate,
  generateStoryListErrorTemplate,
  generateSaveStoryButtonTemplate,
  generateRemoveStoryButtonTemplate,
} from '../../templates';

import * as StoryAPI from '../../data/api';
import Map from '../../utils/map';
import HomePresenter from './home-presenter';
import Database from '../../data/database';

export default class HomePage {
  #presenter = null;
  #map = null;

  async render() {
    return `
      <section>
        <div class="stories-list__map__container">
          <div id="map" class="stories-list__map"></div>
          <div id="map-loading-container"></div>
        </div>
      </section>

      <section class="container">
        <h1 class="section-title">Story List </h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
      dbModel: Database,
    });

    try {
      await this.initialMap();
      const response = await this.#presenter.initialGalleryAndMap();
      console.log(response.listStory);
    } catch (error) {
      this.populateStoryListError('Gagal memuat cerita. Silakan coba lagi nanti.');
      console.error(error);
    }
  }

  async initialMap() {
    this.showMapLoading();
    try {
      this.#map = await Map.build('#map', {
        zoom: 10,
        locate: true,
      });
    } catch (e) {
      console.error('Gagal membuat peta:', e);
    } finally {
      this.hideMapLoading();
    }
  }

  populateStoryList(message, stories) {
    const container = document.getElementById('stories-list');
    if (!container) return;

    if (!stories || stories.length === 0) {
      this.populateStoryListEmpty();
      return;
    }

    const listWrapper = document.createElement('div');
    listWrapper.classList.add('stories-list');

    stories.forEach((story) => {
      if (this.#map) {
        const lat = parseFloat(story.lat);
        const lon = parseFloat(story.lon);
        if (!isNaN(lat) && !isNaN(lon)) {
          this.#map.addMarker([lat, lon], { alt: story.name }, { content: story.description });
        } else {
          console.warn('[WARNING] Story tanpa koordinat valid:', story);
        }
      }

      const wrapper = document.createElement('div');
      wrapper.innerHTML = generateStoryItemTemplate(story); 

      
      const saveContainer = wrapper.querySelector('.save-actions-container');
      if (saveContainer) {
        saveContainer.innerHTML = generateSaveStoryButtonTemplate();
        const saveBtn = saveContainer.querySelector('.report-detail-save');
        saveBtn?.addEventListener('click', async () => {
          await this.#presenter.saveReport(story);
          this.renderRemoveButton(saveContainer, story);
        });
      }

      listWrapper.appendChild(wrapper.firstElementChild);
    });

    container.innerHTML = '';
    container.appendChild(listWrapper);
  }

  renderRemoveButton(container, story) {
    container.innerHTML = generateRemoveStoryButtonTemplate();
    const removeBtn = container.querySelector('.report-detail-remove');
    removeBtn?.addEventListener('click', async () => {
      await this.#presenter.removeReport(story);
      this.renderSaveButton(container, story);
    });
  }

renderSaveButton(container, story) {
  container.innerHTML = generateSaveStoryButtonTemplate();

  const saveBtn = container.querySelector('.report-detail-save');
  saveBtn?.addEventListener('click', async () => {
    await this.#presenter.saveReport(story);
    this.renderRemoveButton(container, story);
  });
}


  populateStoryListEmpty() {
    const container = document.getElementById('stories-list');
    if (container) container.innerHTML = generateStoryListEmptyTemplate();
  }

  populateStoryListError(message) {
    const container = document.getElementById('stories-list');
    if (container) container.innerHTML = generateStoryListErrorTemplate(message);
  }

  saveTosavedSuccessfully(message) {
    console.log(message);
  }

  saveTosavedFailed(message) {
    alert(message);
  }

  removeFromsavedSuccessfully(message) {
    console.log(message);
  }

  removeFromsavedFailed(message) {
    alert(message);
  }

  showMapLoading() {
    const container = document.getElementById('map-loading-container');
    if (container) container.innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    const container = document.getElementById('map-loading-container');
    if (container) container.innerHTML = '';
  }

  showLoading() {
    const container = document.getElementById('stories-list-loading-container');
    if (container) container.innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    const container = document.getElementById('stories-list-loading-container');
    if (container) container.innerHTML = '';
  }
}

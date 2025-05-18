import StoryPresenter from './story-presenter';
import { convertBase64ToBlob } from '../../utils';
import * as StoryAPI from '../../data/api';
import { generateLoaderAbsoluteTemplate } from '../../templates';
import Camera from '../../utils/camera';
import Map from '../../utils/map';

export default class StoryPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenDocumentations = [];
  #map = null;
  async render() {
    return `
      <section>
        <div class="story-story__header">
          <div class="container">
            <h1 class="story-story__header__title">Add story</h1>
          </div>
        </div>
      </section>
      <section class="container">
        <div class="story-form__container">
          <form id="story-form" class="story-form">
          
              
            
            <div class="form-control">
              <label for="description-input" class="story-form__description__title">Masukan teks</label>
              <div class="story-form__description__container">
                <textarea
                  id="description-input"
                  name="description"
                  placeholder="silahkan isi."
                ></textarea>
              </div>
            </div>

            <div class="form-control">
              <label for="documentations-input" class="story-form__documentations__title">Dokumentasi</label>
              
              <div class="story-form__documentations__container">
                <div class="story-form__documentations__buttons">
                  <button id="documentations-input-button" class="btn btn-outline" type="button">Ambil Gambar</button>
                  <input
                    id="documentations-input"
                    class="story-form__documentations__input"
                    name="documentations"
                    type="file"
                    accept="image/*"
                    multiple
                    aria-multiline="true"
                    aria-describedby="documentations-more-info"
                  >
                  <button id="open-documentations-camera-button" class="btn btn-outline" type="button">
                    Buka Kamera
                  </button>
                </div>
                <div id="camera-container" class="story-form__camera__container">
                  <video id="camera-video" class="story-form__camera__video">
                    Video stream not available.
                  </video>
                  <canvas id="camera-canvas" class="story-form__camera__canvas"></canvas>

                  <div class="story-form__camera__tools">
                    <select id="camera-select"></select>
                    <div class="story-form__camera__tools_buttons">
                    <button id="camera-take-button" class="btn" type="button">
                      Ambil Gambar
                    </button>
                  </div>
                  </div>
                </div>
                <ul id="documentations-taken-list" class="story-form__documentations__outputs"></ul>
              </div>
            </div>

            <div class="form-control">
              <div class="story-form__location__title">Lokasi</div>
              <div class="story-form__location__container">
                <div class="story-form__location__map__container">
                  <div id="map" class="story-form__location__map"></div>
                  <div id="map-loading-container"></div>
                </div>
                <div class="story-form__location__lat-lng">
                  <input type="number" name="latitude" value="-6.175389" disabled>
                  <input type="number" name="longitude" value="106.827139" disabled>
                </div>
              </div>
            </div>

            <div class="form-buttons">
              <span id="submit-button-container">
                <button class="btn" type="submit">Bagikan Cerita Kamu</button>
              </span>
              <a class="btn btn-outline" href="#/">Batal</a>
            </div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#form = document.getElementById('story-form');
    this.#takenDocumentations = [];

    this.#presenter = new StoryPresenter({
      view: this,
      model: StoryAPI,
      onMapReady: this.initialMap.bind(this),
      onSubmit: this.#onSubmit.bind(this),
      onShowSubmitLoading: this.showSubmitLoadingButton,
      onHideSubmitLoading: this.hideSubmitLoadingButton,
      onStoreSuccess: this.storeBerhasil.bind(this),
      onstoreGagal: this.storeGagal.bind(this),
      onShowMapLoading: this.showMapLoading,
      onHideMapLoading: this.hideMapLoading,
    });

    this.#presenter.showstoryFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem('description').value,
        evidenceImages: this.#takenDocumentations.map((picture) => picture.blob),
        latitude: this.#form.elements.namedItem('latitude').value,
        longitude: this.#form.elements.namedItem('longitude').value,
      };

      await this.#onSubmit(data);
    });

    document.getElementById('documentations-input').addEventListener('change', async (event) => {
      const insertingPicturesPromises = Array.from(event.target.files).map(async (file) => {
        return await this.#addTakenPicture(file);
      });
      await Promise.all(insertingPicturesPromises);
      await this.#populateTakenPictures();
    });

    document.getElementById('documentations-input-button').addEventListener('click', () => {
      this.#form.elements.namedItem('documentations').click();
    });

    const cameraContainer = document.getElementById('camera-container');
  document
    .getElementById('open-documentations-camera-button')
    .addEventListener('click', async (event) => {
      cameraContainer.classList.toggle('open');
      this.#isCameraOpen = cameraContainer.classList.contains('open');
 
      if (this.#isCameraOpen) {
        event.currentTarget.textContent = 'Tutup Kamera';
        this.#setupCamera();
        this.#camera.launch();
 
        return;
      }
 
      event.currentTarget.textContent = 'Buka Kamera';
      this.#camera.stop();
    });
  }

  async #onSubmit(data) {
    this.showSubmitLoadingButton();
    await this.#presenter.submitForm(data);
    this.hideSubmitLoadingButton();
  }

  async #addTakenPicture(image) {
    let blob = image;

    if (typeof image === 'string' || image instanceof String) {
      blob = await convertBase64ToBlob(image, 'image/png');
    }

    const storyDocumentation = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };

    this.#takenDocumentations = [...this.#takenDocumentations, storyDocumentation];
  }

  async #populateTakenPictures() {
    const html = this.#takenDocumentations.reduce((acc, picture, index) => {
      const imageUrl = URL.createObjectURL(picture.blob);
      return acc + `
        <li class="story-form__documentations__outputs-item">
          <button type="button" data-deletepictureid="${picture.id}" class="story-form__documentations__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="Dokumentasi ke-${index + 1}">
          </button>
        </li>
      `;
    }, '');

    document.getElementById('documentations-taken-list').innerHTML = html;

    document.querySelectorAll('button[data-deletepictureid]').forEach((button) => {
      button.addEventListener('click', (event) => {
        const id = event.currentTarget.dataset.deletepictureid;
        const deleted = this.#hapusGambar(id);
        if (!deleted) console.log(`Gagal menghapus gambar dengan id: ${id}`);
        this.#populateTakenPictures();
      });
    });
  }

  #hapusGambar(id) {
    const selectedPicture = this.#takenDocumentations.find((p) => p.id == id);
    if (!selectedPicture) return null;
    this.#takenDocumentations = this.#takenDocumentations.filter((p) => p.id != id);
    return selectedPicture;
  }

  async initialMap() {
    this.#map = await Map.build('#map', {
      zoom: 15,
      locate: true,
    });

     
    const centerCoordinate = this.#map.getCenter();
    this.#updateLatLngInput(centerCoordinate.latitude, centerCoordinate.longitude);
    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: 'true' },
    );
    draggableMarker.addEventListener('move', (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });
    this.#map.addMapEventListener('click', (event) => {
      draggableMarker.setLatLng(event.latlng);
    });
  }
  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem('latitude').value = latitude;
    this.#form.elements.namedItem('longitude').value = longitude;
  }

  #setupCamera() {
    if (this.#camera) {
      return;
    }

    this.#camera = new Camera({
      video: document.getElementById('camera-video'),
      cameraSelect: document.getElementById('camera-select'),
      canvas: document.getElementById('camera-canvas'),
    });

    this.#camera.addCheeseButtonListener('#camera-take-button', async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#populateTakenPictures();
    });
  }

  storeBerhasil(message) {
    console.log(message);
    this.hapusForm();
    location.href = '#/';
  }

  storeGagal(message) {
    alert(message);
  }

  hapusForm() {
    this.#form.reset();
    this.#takenDocumentations = [];
    this.#populateTakenPictures();
  }

  showMapLoading() {
    document.getElementById('map-loading-container').innerHTML = generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById('map-loading-container').innerHTML = '';
  }

  showSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit" disabled>
        <i class="fas fa-spinner loader-button"></i> Buat Cerita
      </button>
    `;
  }

  hideSubmitLoadingButton() {
    document.getElementById('submit-button-container').innerHTML = `
      <button class="btn" type="submit">Buat Cerita</button>
    `;
  }
}

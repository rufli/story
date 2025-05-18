import { showFormattedDate } from './utils';

export function generateLoaderTemplate() {
  return `
    <div class="loader"></div>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateMainNavigationListTemplate() {
  return `
    <li><a id="report-list-button" class="report-list-button" href="#/">story list</a></li>
    <li><a id="saved-button" class="saved-button" href="#/saved">story saved</a></li>
  `;


}

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <li><a id="register-button" href="#/register">Register</a></li>
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="story-report-button" class="btn story-report-button" href="#/story">add story <i class="fas fa-plus"></i></a></li>
    <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}
export function generateStoryListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada cerita yang tersedia</h2>
      <p>Saat ini, tidak ada cerita yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoryListErrorTemplate(message) {
  return `
    <div id="stories-list-error" class="stories-list__error">
      <h2>Terjadi kesalahan pengambilan daftar cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
    <div id="reports-detail-error" class="reports-detail__error">
      <h2>Terjadi kesalahan pengambilan detail Cerita</h2>
      <p>${message ? message : 'Gunakan jaringan lain atau laporkan error ini.'}</p>
    </div>
  `;
}


export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  lat, 
  lon,  
}) {
  return `
    <div tabindex="0" class="story-item" data-reportid="${id}">
      <img class="story-item__image" src="${photoUrl}" alt="${name || 'Story Image'}">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="report-title" class="story-item__title">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i> ${showFormattedDate(createdAt)}
            </div>
            ${
              lat !== undefined && lon !== undefined
                ? `<div class="story-item__location">
                    <i class="fas fa-map"></i> Latitude: ${lat}, Longitude: ${lon}
                  </div>`
                : ''
            }
          </div>
        </div>
        <div id="report-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-detail__body__actions__container">
          <div class="story-detail__actions__buttons">
          <div class="save-actions-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}




export function generateStoryDetailImageTemplate(imageUrl = null, alt = '') {
  if (!imageUrl) {
    return `
      <img class="report-detail__image" src="images/placeholder-image.jpg" alt="Placeholder Image">
    `;
  }

  return `
    <img class="report-detail__image" src="${imageUrl}" alt="${alt}">
  `;
}


export function generateSubscribeButtonTemplate() {
  return `
    <button id="subscribe-button" class="btn subscribe-button">
      Subscribe <i class="fas fa-bell"></i>
    </button>
  `;
}

export function generateUnsubscribeButtonTemplate() {
  return `
    <button id="unsubscribe-button" class="btn unsubscribe-button">
      Unsubscribe <i class="fas fa-bell-slash"></i>
    </button>
  `;
}

export function generateSaveStoryButtonTemplate() {
  return `
<button class="report-detail-save btn btn-transparent">
  Simpan Cerita <i class="far fa-saved"></i>
</button>

  `;
}

export function generateRemoveStoryButtonTemplate() {
  return `
<button class="report-detail-remove btn btn-transparent">
  Buang Cerita <i class="fas fa-saved"></i>
</button>

  `;
}

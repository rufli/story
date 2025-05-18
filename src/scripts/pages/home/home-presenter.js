export default class HomePresenter {
  #reportId;
  #view;
  #model;
  #dbModel;

  constructor({ view, model, dbModel = null, reportId = null }) {
    this.#view = view;
    this.#model = model;
    this.#dbModel = dbModel;
    this.#reportId = reportId;
  }

  async showStoriesListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('[ERROR] showStoriesListMap:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    console.log('[DEBUG] initialGalleryAndMap called');
    this.#view.showLoading();
    try {
      await this.showStoriesListMap();

      const response = await this.#model.getAllStories();
      console.log('[DEBUG] response:', response);

      if (!response.ok) {
        console.error('[ERROR] Response not OK:', response.message);
        this.#view.populateStoryListError(response.message);
        return;
      }

      this.#view.populateStoryList(response.message, response.listStory);
      return response;
    } catch (error) {
      console.error('[ERROR] initialGalleryAndMap:', error);
      this.#view.populateStoryListError(error.message || 'Terjadi kesalahan.');
    } finally {
      this.#view.hideLoading();
    }
  }

  async notifyMe() {
    try {
      const response = await this.#model.sendReportToMeViaNotification(this.#reportId);

      if (!response.ok) {
        console.error('[ERROR] notifyMe failed:', response);
        return;
      }

      console.log('[INFO] notifyMe success:', response.message);
    } catch (error) {
      console.error('[ERROR] notifyMe exception:', error);
    }
  }

async saveReport(story) {
  try {
   
    await this.#dbModel.putReport(story);
    this.#view.saveTosavedSuccessfully('Berhasil disimpan ke saved');
  } catch (error) {
    console.error('[ERROR] saveReport:', error);
    this.#view.saveTosavedFailed(error.message || 'Gagal menyimpan saved');
  }
}

async removeReport(story) {
  try {
    await this.#dbModel.removeReport(story.id);
    this.#view.removeFromsavedSuccessfully('Berhasil dihapus dari saved');
  } catch (error) {
    console.error('[ERROR] removeReport:', error);
    this.#view.removeFromsavedFailed(error.message || 'Gagal menghapus saved');
  }
}

  async showSaveButton() {
    if (!this.#reportId || !this.#dbModel) return;

    const isSaved = await this.#isReportSaved();

    if (isSaved) {
      this.#view.renderRemoveButton();
    } else {
      this.#view.renderSaveButton();
    }
  }

  async #isReportSaved() {
    const report = await this.#dbModel.getStoryById(this.#reportId);
    return !!report;
  }
}

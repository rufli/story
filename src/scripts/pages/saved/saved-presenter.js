export default class SavedPresenter {
  #view;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#dbModel = dbModel;
  }

  async showReportsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportsListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    console.log('[DEBUG] initialGalleryAndMap called');
    this.#view.showReportsListLoading();

    try {
      await this.showReportsListMap();

      
      const savededReports = await this.#dbModel.getAllReports();
      console.log('[DEBUG] savededReports:', savededReports);

      const message = 'Berhasil memuat cerita tersimpan.';
      this.#view.populatesavededReports(message, savededReports);
      return {
        message,
        listStory: savededReports,
      };
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populatesavededReportsError('Gagal memuat cerita. Silakan coba lagi nanti.');
    } finally {
      this.#view.hideReportsListLoading();
    }
  }

async removeReport(report, wrapper) {
  try {
    
    await this.#dbModel.removeReport(report.id);
    console.log('Cerita berhasil dihapus dari saved');
    
   
    if (wrapper) {
      wrapper.remove();  
    }

    
    const updatedReports = await this.#dbModel.getAllReports();
    const message = 'Cerita berhasil dihapus dari saved';
    this.#view.populatesavededReports(message, updatedReports);

  } catch (error) {
    console.error('removeReport: error:', error);
    
    this.#view.populatesavededReportsError('Gagal menghapus Cerita. Silakan coba lagi nanti.');
  }
}

}

export default class StoryPresenter {
    #view;
    #model;
  
    constructor({ view, model }) {
      this.#view = view;
      this.#model = model;
    }
  
    async showstoryFormMap() {
      this.#view.showMapLoading();
      try {
        await this.#view.initialMap();
      } catch (error) {
        console.error('showstoryFormMap: error:', error);
      } finally {
        this.#view.hideMapLoading();
      }
    }
  
    async poststoryStory({ description, photo, latitude, longitude }) {
      this.#view.showSubmitLoadingButton();
      try {
        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        if (latitude) formData.append('lat', latitude);
        if (longitude) formData.append('lon', longitude);
  
        const response = await this.#model.storestoryStory(formData);
  
        if (!response || response.error) {
          this.#view.storeGagal(response?.message || 'Gagal menyimpan Cerita.');
          return;
        }
  
        this.#view.storeBerhasil(response.message);
      } catch (error) {
        console.error('poststoryStory: error:', error);
        this.#view.storeGagal(error.message);
      } finally {
        this.#view.hideSubmitLoadingButton();
      }
    }
    async submitForm({ description, evidenceImages, latitude, longitude }) {
        this.#view.showSubmitLoadingButton();
      
        try {
          const formData = new FormData();
          formData.append('description', description);
      
          if (latitude) formData.append('lat', latitude);
          if (longitude) formData.append('lon', longitude);
      
          evidenceImages.forEach((image, index) => {
            formData.append(`photo`, image); 
          });
      
          const response = await this.#model.storestoryStory(formData);
      
          if (!response || response.error) {
            this.#view.storeGagal(response?.message || 'Gagal menyimpan Cerita.');
            return;
          }
      
          this.#view.storeBerhasil(response.message);
        } catch (error) {
          console.error('submitForm error:', error);
          this.#view.storeGagal(error.message);
        } finally {
          this.#view.hideSubmitLoadingButton();
        }
      }
      
  }
  
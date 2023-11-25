import { Project } from "../../Types/Project";

export class ProjectService {
  private db: IDBDatabase | null = null;

  async initDB() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("ProjectDB", 1);

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        if (!this.db.objectStoreNames.contains("projects")) {
          this.db.createObjectStore("projects", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = (event) => {
        console.error("IndexedDB error:", request.error);
        reject(request.error);
      };
    });
  }

  async createProject(project: Project): Promise<string> {
    return this.saveProject(project);
  }

  async saveProject(project: Project): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("DB not initialized");
        return;
      }

      const transaction = this.db.transaction("projects", "readwrite");
      const store = transaction.objectStore("projects");
      const request = store.put(project);

      request.onsuccess = () => {
        resolve(request.result as string);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getProject(id: string): Promise<Project | undefined> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("DB not initialized");
        return;
      }

      const transaction = this.db.transaction("projects", "readonly");
      const store = transaction.objectStore("projects");
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as Project);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async updateProject(project: Project): Promise<string> {
    if (project.id === undefined) {
      throw new Error("Project ID is required for update");
    }
    return this.saveProject(project);
  }

  async deleteProject(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("DB not initialized");
        return;
      }

      const transaction = this.db.transaction("projects", "readwrite");
      const store = transaction.objectStore("projects");
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async listProjects(): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject("DB not initialized");
        return;
      }

      const transaction = this.db.transaction("projects", "readonly");
      const store = transaction.objectStore("projects");
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as Project[]);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }
}

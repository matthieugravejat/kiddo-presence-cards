import { useEffect, useState } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export function useFilesystemStorage<T>(filename: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await Filesystem.readFile({
          path: filename,
          directory: Directory.Data,
          encoding: Encoding.UTF8, // <-- garantit que "data" est une string
        });

        // On force ici le typage
        const data = result.data as string;
        const parsed = JSON.parse(data);
        setStoredValue(parsed);
      } catch (error) {
        console.warn(`Fichier ${filename} non trouvé ou invalide.`, error);
        setStoredValue(initialValue);
      }
    };

    load();
  }, [filename]);

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);

    Filesystem.writeFile({
      path: filename,
      data: JSON.stringify(valueToStore),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    }).catch(err => console.error("Erreur d'écriture :", err));
  };

  return [storedValue, setValue] as const;
}

import { useState } from "react";
import { toast } from "sonner";

export const useLogoUpload = (initialUrl?: string) => {
  const [logoUrl, setLogoUrl] = useState(initialUrl || "");
  const [logoPreview, setLogoPreview] = useState(initialUrl || "");
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const uploadLogo = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Seuls les fichiers image sont acceptés");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille du fichier ne doit pas dépasser 5 MB");
      return false;
    }

    setIsUploadingLogo(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Échec de l'upload");
      }

      const data = await response.json();
      setLogoUrl(data.url);
      setLogoPreview(data.url);
      toast.success("Logo uploadé avec succès");
      return true;
    } catch (error) {
      toast.error("Erreur lors de l'upload du logo");
      console.error("Logo upload error:", error);
      return false;
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setLogoUrl("");
    setLogoPreview("");
  };

  return {
    logoUrl,
    logoPreview,
    isUploadingLogo,
    uploadLogo,
    removeLogo,
  };
};


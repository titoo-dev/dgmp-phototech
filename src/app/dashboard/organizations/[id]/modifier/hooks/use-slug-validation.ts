import { useState, useEffect } from "react";
import { generateSlug, validateSlugFormat } from "../utils";

export const useSlugValidation = (name: string, initialSlug?: string) => {
  const [slug, setSlug] = useState(initialSlug || "");
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!slugTouched && name) {
      setSlug(generateSlug(name));
    }
  }, [name, slugTouched]);

  const validation = validateSlugFormat(slug);
  const showValidation = slugTouched && !!slug;

  const handleSlugChange = (value: string) => {
    setSlug(value);
    setSlugTouched(true);
  };

  const handleSlugBlur = () => {
    setSlugTouched(true);
  };

  return {
    slug,
    validation,
    showValidation,
    handleSlugChange,
    handleSlugBlur,
  };
};


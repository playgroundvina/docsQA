export const handleClickBlog = (item, router) => {
  typeof window !== "undefined" && localStorage.setItem("idBlog", item?.id);
  const nameReplace = item?.title
    .replaceAll(/\s+|[:\s\-]+/g, "-")
    .toLowerCase()
    .trim();
  router.push(`blogs/${nameReplace}`);
};

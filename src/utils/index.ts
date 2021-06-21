type EscapeEntities = {
  lt: string;
  gt: string;
  nbsp: string;
  amp: string;
  quot: string;
};

export const escape2Html = (str: string): string => {
  const arrEntities: EscapeEntities = {
    lt: "<",
    gt: ">",
    nbsp: " ",
    amp: "&",
    quot: '"',
  };

  return str.replace(
    /&(lt|gt|nbsp|amp|quot);/gi,
    function (all, t: keyof EscapeEntities) {
      return arrEntities[t];
    }
  );
};

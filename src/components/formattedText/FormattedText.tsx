type FormattedTextProps = {
  text?: string;
};

const parseInlineFormatting = (text: string) => {
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");
  formatted = formatted.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  return formatted;
};

const FormattedText = ({ text }: FormattedTextProps) => {
  if (!text) return null;

  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim() !== "");

  return (
    <>
      {paragraphs.map((paragraph, index) => {
        const html = parseInlineFormatting(paragraph).replace(/\n/g, "<br/>");

        return (
          <p
            key={index}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      })}
    </>
  );
};

export default FormattedText;
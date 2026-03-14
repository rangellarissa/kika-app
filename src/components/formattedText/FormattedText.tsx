type FormattedTextProps = {
  text?: string;
};

const parseInlineFormatting = (text: string) => {
  // bold **text**
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  // italic *text*
  formatted = formatted.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // links [text](url)
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
        const lines = paragraph.split("\n");

        return (
          <p key={index}>
            {lines.map((line, i) => (
              <span
                key={i}
                dangerouslySetInnerHTML={{
                  __html: parseInlineFormatting(line)
                }}
              />
            )).reduce((prev, curr, i) => (
              <>
                {prev}
                <br />
                {curr}
              </>
            ))}
          </p>
        );
      })}
    </>
  );
};

export default FormattedText;
import React, { useState } from "react";
import { Clipboard, CheckLg } from "react-bootstrap-icons";
const HighlightSearch = ({ content, searchTerm }) => {
  const [copied, setCopied] = useState(false);
  // Function to highlight the search term within the content
  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;

    // Creating a regular expression with global flag to match all occurrences of the search term
    const regex = new RegExp(`(${searchTerm})`, "gi");

    // Function to handle highlighting while preserving HTML tags
    const replaceText = (match) =>
      `<mark style="background-color: yellow;">${match}</mark>`;

    // Split the text into parts containing HTML tags and plain text
    const parts = text.split(/(<[^>]*>)/);

    // Map through the parts and apply highlighting to plain text parts only
    const highlightedParts = parts.map((part) => {
      // Check if the part is plain text (not HTML tag)
      if (!part.startsWith("<")) {
        // Replace the search term with the highlighted version
        return part.replace(regex, replaceText);
      }
      // Return the original HTML tag unchanged
      return part;
    });

    // Join the parts back into a single string
    const highlightedText = highlightedParts.join("");

    return highlightedText;
  };
  // Function to copy the highlighted content to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(highlightedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };
  const highlightedContent = highlightText(content, searchTerm);

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button
          className="clipBordBtn"
          style={{ border: "0px" }}
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <CheckLg /> Copied!
            </>
          ) : (
            <>
              <Clipboard /> Copy to Clipboard
            </>
          )}
        </button>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html: highlightedContent,
        }}
      />
    </div>
  );
};

export default HighlightSearch;

import React, { useState } from 'react';
import AutoSuggest from 'react-autosuggest';

export interface CountryInputProps {
  countries: string[];
}

export default function CountryInput({ countries }: CountryInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = (value: string) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : countries.filter((country) =>
          country.toLowerCase().startsWith(inputValue)
        );
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion: string) => suggestion;

  // Use your imagination to render suggestions.
  const renderSuggestion = (suggestion: string) => <div>{suggestion}</div>;

  return (
    <AutoSuggest
      getSuggestionValue={getSuggestionValue}
      suggestions={suggestions}
      renderSuggestion={renderSuggestion}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      inputProps={{
        value: inputValue,
        onChange: (evt, { newValue }) => setInputValue(newValue),
        placeholder: 'Enter your country'
      }}
    />
  );
}

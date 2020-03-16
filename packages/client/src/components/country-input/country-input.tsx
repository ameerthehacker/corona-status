import React, { useState, ReactNode, FormEvent } from 'react';
import AutoSuggest, {
  RenderSuggestionParams,
  SuggestionSelectedEventData
} from 'react-autosuggest';
import Input from '@chakra-ui/core/dist/Input';
import InputGroup from '@chakra-ui/core/dist/InputGroup';
import { InputRightElement } from '@chakra-ui/core/dist/InputElement';
import Box from '@chakra-ui/core/dist/Box';
import Flex from '@chakra-ui/core/dist/Flex';
import Icon from '@chakra-ui/core/dist/Icon';
import Button from '@chakra-ui/core/dist/Button';
import useColorScheme from '../use-color-scheme/use-color-sheme';
import './country-input.css';

export interface CountryInputProps {
  countries: string[];
  initialCountry: string | null;
  onSelected: (country: string) => void;
}

export default function CountryInput({
  countries,
  onSelected,
  initialCountry
}: CountryInputProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>(initialCountry || '');
  const { bgColor, color } = useColorScheme();
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

  const renderInput = (inputProps: any) => {
    return (
      <InputGroup>
        <Input borderRadius={0} {...inputProps} variant="outline" size="lg" />
        {inputValue.length > 0 && (
          <InputRightElement>
            <Button onClick={() => setInputValue('')} variant="ghost">
              <Icon name="close" />
            </Button>
          </InputRightElement>
        )}
      </InputGroup>
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

  const renderSuggestion = (
    suggestion: string,
    { isHighlighted }: RenderSuggestionParams
  ) => {
    return (
      <Box
        color={isHighlighted ? bgColor : color}
        borderWidth={0.25}
        bg={isHighlighted ? color : bgColor}
        py={3}
        textAlign="center"
      >
        {suggestion}
      </Box>
    );
  };

  const renderSugesstionContainer = ({
    containerProps,
    children
  }: {
    children: ReactNode;
    containerProps: any;
  }) => {
    return (
      <Flex
        {...containerProps}
        bg={bgColor}
        justifyContent="center"
        className="suggestions-contaier"
      >
        {children}
      </Flex>
    );
  };

  return (
    <AutoSuggest
      getSuggestionValue={getSuggestionValue}
      suggestions={suggestions}
      renderSuggestion={renderSuggestion}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      renderSuggestionsContainer={renderSugesstionContainer}
      inputProps={{
        value: inputValue,
        onChange: (evt, { newValue }) => setInputValue(newValue),
        placeholder: 'Enter your country'
      }}
      highlightFirstSuggestion={true}
      renderInputComponent={renderInput}
      onSuggestionSelected={(
        evt: FormEvent,
        data: SuggestionSelectedEventData<string>
      ) => {
        onSelected(data.suggestionValue);
      }}
    />
  );
}

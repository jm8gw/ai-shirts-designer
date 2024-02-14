import CustomButton from "./CustomButton";


const AIPicker = ({ prompt, setPrompt, generatingImg, handleSubmit }) => {
  return (
    <div className="aipicker-container">
      <textarea // not an input so we have more space to write the prompt
        className="aipicker-textarea"
        placeholder="Enter a prompt for the AI to generate something for you!"
        value={prompt}
        rows={5}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <div className="flex flex-wrap gap-3">
        {generatingImg ? ( // are we currently generating an image?
          <CustomButton 
            type="outline"
            title="Asking AI..."
            customStyles="text-xs"
          />
        ) : (
          <>
            <CustomButton
              type="outline"
              title="AI Logo"
              handleClick={() => handleSubmit('logo')}
              customStyles="text-xs"
            />
            <CustomButton
              type="filled"
              title="AI Full"
              handleClick={() => handleSubmit('full')}
              customStyles="text-xs"
            />
          </>
        )}
      </div>
    </div>
  )
}

export default AIPicker
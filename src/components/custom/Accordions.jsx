import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/Modal";
import { AccordionsData } from "@/data/data";

const Accordions = () => {
  const [accordionData, setAccordionData] = useState(AccordionsData);
  const [showActions, setShowActions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newAccordion, setNewAccordion] = useState({
    name: "",
    questions: [{ id: 1, question: "", answer: "No" }],
    isEditable: true,
  });

  const handleAnswerChange = (accordionId, questionId, answer) => {
    const updatedData = accordionData.map((accordion) => {
      if (accordion.id === accordionId) {
        return {
          ...accordion,
          questions: accordion.questions.map((question) =>
            question.id === questionId ? { ...question, answer } : question
          ),
        };
      }
      return accordion;
    });
    setAccordionData(updatedData);
    setShowActions(true);
    
    // Recheck and update editability based on the current state after answer change
    const updatedIndex = updatedData.findIndex((accordion) => accordion.id === accordionId);
    checkAndUpdateEditability(updatedIndex);
  };
  

  const handleSave = (accordionId) => {
    const updatedData = [...accordionData]; // Create a copy of the original accordion data
  
    const checkAndUpdateEditability = (index) => {
      // Check if all answers in the current accordion are "Yes" or "NA"
      const allAnsweredYesOrNA = updatedData[index].questions.every(
        (q) => q.answer === "Yes" || q.answer === "NA"
      );
  
      // If all answers are "Yes" or "NA", enable the next accordion
      if (allAnsweredYesOrNA && index + 1 < updatedData.length) {
        updatedData[index + 1].isEditable = true;
        // Recursively check if the next accordion should also be enabled
        checkAndUpdateEditability(index + 1);
      } else {
        // If not all answers are "Yes" or "NA", disable all subsequent accordions
        for (let i = index + 1; i < updatedData.length; i++) {
          updatedData[i].isEditable = false;
        }
      }
    };
  
    updatedData.forEach((accordion, index) => {
      if (accordion.id === accordionId) {
        checkAndUpdateEditability(index);
      }
    });
  
    setAccordionData(updatedData); // Update the state with the modified data
    setShowActions(false); // Hide actions
  };
  
  

  const handleAddQuestion = () => {
    setNewAccordion((prev) => {
      // Filter out empty questions
      const filteredQuestions = prev.questions.filter(
        (q) => q.question.trim() !== ""
      );

      return {
        ...prev,
        questions: [
          ...filteredQuestions,
          { id: prev.questions.length + 1, question: "", answer: "No" },
        ],
      };
    });
  };

  const handleRemoveQuestion = (id) => {
    setNewAccordion((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleSaveNewAccordion = () => {
    // Filter out empty questions from the new accordion
    const validQuestions = newAccordion.questions.filter(
      (q) => q.question.trim() !== ""
    );

    // Check if the last accordion has all questions answered with "Yes" or "NA"
    const lastAccordion = accordionData[accordionData.length - 1];
    const lastAccordionValid = lastAccordion
      ? lastAccordion.questions.every(
          (q) => q.answer === "Yes" || q.answer === "NA"
        )
      : false;

    // Set new accordion's editability based on the previous accordion's validity
    const newAccordionData = {
      id: accordionData.length + 1,
      accordionName: newAccordion.name,
      questions: validQuestions.map((q) => ({
        ...q,
        answer: "No", // Default answer for new questions
      })),
      isEditable: lastAccordionValid, // Set the new accordion as editable only if the last accordion's questions are valid
    };

    setAccordionData((prev) => [...prev, newAccordionData]);
    setNewAccordion({
      name: "",
      questions: [{ id: 1, question: "", answer: "No" }],
      isEditable: true,
    });
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowActions(false);
  };

  return (
    <>
      {/* Create Accordion Button */}
      <Button onClick={() => setShowModal(true)}>Create Accordion</Button>

      {/* Accordions Display */}
      <Accordion type="single" collapsible>
        {accordionData.map((accordion, index) => (
          <AccordionItem key={accordion.id} value={`accordion-${accordion.id}`}>
            <AccordionTrigger>{accordion.accordionName ? accordion.accordionName : `Accordion ${index + 1}`}</AccordionTrigger>
            <AccordionContent>
              {accordion.questions.map((question) => (
                <div key={question.id} className="mb-4">
                  <Label className="text-lg font-medium">
                    {question.question}
                  </Label>
                  <RadioGroup
                    value={question.answer}
                    onValueChange={(value) =>
                      handleAnswerChange(accordion.id, question.id, value)
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="Yes"
                        id={`accordion-${accordion.id}-question-${question.id}-yes`}
                        disabled={!accordion.isEditable}
                      />
                      <Label
                        htmlFor={`accordion-${accordion.id}-question-${question.id}-yes`}
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="No"
                        id={`accordion-${accordion.id}-question-${question.id}-no`}
                        disabled={!accordion.isEditable}
                      />
                      <Label
                        htmlFor={`accordion-${accordion.id}-question-${question.id}-no`}
                      >
                        No
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem
                        value="NA"
                        id={`accordion-${accordion.id}-question-${question.id}-na`}
                        disabled={!accordion.isEditable}
                      />
                      <Label
                        htmlFor={`accordion-${accordion.id}-question-${question.id}-na`}
                      >
                        NA
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              ))}
              {showActions && accordion.isEditable && (
                <div className="mt-4 flex gap-4">
                  <Button onClick={() => handleSave(accordion.id)}>Save</Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Create Accordion Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)} title="Create Accordion">
          <div>
            <Label className="block text-lg font-medium">Accordion Name</Label>
            <input
              type="text"
              className="block w-full mt-2 mb-4 border border-gray-300 rounded-md p-2"
              value={newAccordion.name}
              onChange={(e) =>
                setNewAccordion({ ...newAccordion, name: e.target.value })
              }
            />
            <div>
              <Label className="block text-lg font-medium mb-2">
                Questions
              </Label>
              {newAccordion.questions.map((q, index) => (
                <div key={q.id} className="flex gap-2 mb-4">
                  <input
                    type="text"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                    placeholder={`Question ${index + 1}`}
                    value={q.question}
                    onChange={(e) =>
                      setNewAccordion((prev) => ({
                        ...prev,
                        questions: prev.questions.map((ques) =>
                          ques.id === q.id
                            ? { ...ques, question: e.target.value }
                            : ques
                        ),
                      }))
                    }
                  />
                  <Button
                    variant="secondary"
                    onClick={() => handleRemoveQuestion(q.id)}
                    disabled={newAccordion.questions.length === 1}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button onClick={handleAddQuestion}>Add More</Button>
            </div>
            <div className="mt-4 flex gap-4">
              <Button onClick={handleSaveNewAccordion}>Save</Button>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default Accordions;

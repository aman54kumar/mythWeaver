/**
 * PDF and Image generation service for MythWeaver stories
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * Generate a beautiful PDF from story data
 * @param {Object} storyData - The complete story data
 * @param {string} scenario - The original input scenario
 * @returns {Blob} PDF blob
 */
export const generateStoryPDF = async (storyData, scenario) => {
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  
  let yPosition = margin
  
  // Title
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(218, 165, 32) // Gold color
  
  const titleLines = pdf.splitTextToSize(storyData.title, contentWidth)
  pdf.text(titleLines, margin, yPosition)
  yPosition += titleLines.length * 10 + 10
  
  // Cultural tradition
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(160, 160, 160)
  pdf.text(`${storyData.meta.culture.charAt(0).toUpperCase() + storyData.meta.culture.slice(1)} Tradition`, margin, yPosition)
  yPosition += 15
  
  // Divider line
  pdf.setDrawColor(218, 165, 32)
  pdf.setLineWidth(0.5)
  pdf.line(margin, yPosition, pageWidth - margin, yPosition)
  yPosition += 15
  
  // Original Scenario Section
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(218, 165, 32)
  pdf.text('Your Modern Scenario', margin, yPosition)
  yPosition += 10
  
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(60, 60, 60)
  const scenarioLines = pdf.splitTextToSize(scenario, contentWidth)
  pdf.text(scenarioLines, margin, yPosition)
  yPosition += scenarioLines.length * 5 + 15
  
  // Story Section
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(218, 165, 32)
  pdf.text('Your Ancient Myth', margin, yPosition)
  yPosition += 10
  
  pdf.setFontSize(11)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(40, 40, 40)
  const storyLines = pdf.splitTextToSize(storyData.adapted_story, contentWidth)
  
  // Check if we need a new page
  if (yPosition + (storyLines.length * 5) > pageHeight - margin) {
    pdf.addPage()
    yPosition = margin
  }
  
  pdf.text(storyLines, margin, yPosition)
  yPosition += storyLines.length * 5 + 15
  
  // Interactive Choices Section
  if (yPosition > pageHeight - 80) {
    pdf.addPage()
    yPosition = margin
  }
  
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(218, 165, 32)
  pdf.text('Choose Your Path', margin, yPosition)
  yPosition += 15
  
  storyData.choices.forEach((choice, index) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      pdf.addPage()
      yPosition = margin
    }
    
    // Choice label
    pdf.setFontSize(12)
    pdf.setFont('helvetica', 'bold')
    pdf.setTextColor(218, 165, 32)
    pdf.text(`${index + 1}. ${choice.label}`, margin, yPosition)
    yPosition += 8
    
    // Choice outcome
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(60, 60, 60)
    const outcomeLines = pdf.splitTextToSize(choice.outcome, contentWidth - 5)
    pdf.text(outcomeLines, margin + 5, yPosition)
    yPosition += outcomeLines.length * 4 + 8
  })
  
  // Footer
  if (yPosition > pageHeight - 30) {
    pdf.addPage()
    yPosition = margin
  }
  
  yPosition = pageHeight - 15
  pdf.setFontSize(8)
  pdf.setFont('helvetica', 'italic')
  pdf.setTextColor(128, 128, 128)
  pdf.text('Generated with MythWeaver.fun', margin, yPosition)
  pdf.text(`Created: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, yPosition)
  
  return pdf.output('blob')
}

/**
 * Generate a shareable image card for social media
 * @param {Object} storyData - The story data
 * @param {string} scenario - The original scenario
 * @returns {Promise<Blob>} Image blob
 */
export const generateShareImage = async (storyData, scenario) => {
  // Create a temporary div for rendering
  const container = document.createElement('div')
  container.style.cssText = `
    width: 1200px;
    height: 630px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #f5f5dc;
    font-family: 'Times New Roman', serif;
    padding: 60px;
    box-sizing: border-box;
    position: absolute;
    left: -9999px;
    top: -9999px;
  `
  
  container.innerHTML = `
    <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; margin-bottom: 30px;">
          <div style="width: 40px; height: 40px; background: linear-gradient(45deg, #daa520, #ffd700); border-radius: 8px; margin-right: 15px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #1a1a2e; font-weight: bold; font-size: 20px;">M</span>
          </div>
          <h1 style="margin: 0; font-size: 32px; color: #daa520; font-weight: bold;">MythWeaver</h1>
        </div>
        
        <h2 style="margin: 0 0 20px 0; font-size: 36px; line-height: 1.2; color: #daa520; font-weight: bold;">
          ${storyData.title}
        </h2>
        
        <p style="margin: 0 0 20px 0; font-size: 16px; color: #f5f5dc; opacity: 0.8; font-style: italic;">
          ${storyData.meta.culture.charAt(0).toUpperCase() + storyData.meta.culture.slice(1)} Tradition
        </p>
        
        <p style="margin: 0; font-size: 18px; line-height: 1.4; color: #f5f5dc;">
          ${storyData.adapted_story.length > 200 ? storyData.adapted_story.substring(0, 200) + '...' : storyData.adapted_story}
        </p>
      </div>
      
      <div style="text-align: center; opacity: 0.7;">
        <p style="margin: 0; font-size: 16px; color: #daa520;">
          Transform your modern scenarios into ancient myths
        </p>
        <p style="margin: 5px 0 0 0; font-size: 18px; font-weight: bold; color: #ffd700;">
          mythweaver.fun
        </p>
      </div>
    </div>
  `
  
  document.body.appendChild(container)
  
  try {
    const canvas = await html2canvas(container, {
      backgroundColor: null,
      scale: 1,
      useCORS: true,
      allowTaint: true
    })
    
    document.body.removeChild(container)
    
    return new Promise((resolve) => {
      canvas.toBlob(resolve, 'image/png', 0.9)
    })
  } catch (error) {
    document.body.removeChild(container)
    throw error
  }
}

/**
 * Download a file blob with given filename
 * @param {Blob} blob - The file blob
 * @param {string} filename - The filename
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

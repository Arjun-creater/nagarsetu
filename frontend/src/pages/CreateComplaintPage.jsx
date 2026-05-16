import { useState } from "react"
import { analyzeComplaintImage } from "../services/aiService"
import { createComplaint } from "../services/complaintService"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

const CreateComplaintPage = () => {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [aiResult, setAiResult] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    address: "",
  })

  const handleImageUpload = (e) => {

  const file = e.target.files[0]

  if (!file) return

  if (file.size > 10 * 1024 * 1024) {

    toast.error(
      "Image size must be under 10MB."
    )

    return
  }

  setImage(file)

  setPreview(
    URL.createObjectURL(file)
  )

  // Reset AI result when new image uploaded
  setAiResult(null)

  setFormData({

    title: "",

    description: "",

    department: "",

    address: "",

    priority: "",
  })
}

  const handleAnalyze = async () => {

  if (!image) return

  try {

    setLoading(true)

    const data =
      await analyzeComplaintImage(
        image
      )

    // Invalid civic image
    if (!data.is_civic_issue) {

      setAiResult(null)

      setFormData({

        title: "",

        description: "",

        department: "",

        address: "",

        priority: "",
      })

      toast.error(

        data.message ||

        "This image does not appear related to a civic issue."
      )

      return
    }

    // Valid civic image
    setAiResult(data)

    setFormData({

      title:
        data.suggested_title || "",

      description:
        data.suggested_description || "",

      department:
        data.department || "",

      priority:
        data.priority || "",

      address:
        data.address || "",
    })

  } catch (error) {

    console.error(
      "Submission failed:",
      error.response?.data
    )

    toast.error(
      "Failed to analyze image."
    )

  } finally {

    setLoading(false)
  }
}

  const handleSubmitComplaint = async () => {
    try {
      setSubmitLoading(true)
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        final_ai_department: formData.department.trim(),
        address:
  formData.address,
      }

      if (!payload.title || !payload.description) {
        alert("Please fill in title and description.")
        return
      }
      if (!image) {
  toast.error(
    "Please upload complaint image."
  )
  return
}

if (!formData.title.trim()) {
  toast.error(
    "Please enter complaint title."
  )
  return
}

if (!formData.description.trim()) {
  toast.error(
    "Please enter complaint description."
  )
  return
}

if (!formData.address.trim()) {
  toast.error(
    "Please enter complaint address."
  )
  return
}

      const response = await createComplaint(payload)
      console.log("Complaint created:", response)
      
      // Reset form
      setImage(null)
      setPreview(null)
      setAiResult(null)
      setFormData({ title: "", description: "", department: "", priority: "" })
      
      toast.success(
  "Complaint submitted successfully!"
)

setTimeout(() => {
  navigate("/complaints")
}, 1500)
    } catch (error) {
      console.error(
    "Submission failed:",
    error.response?.data
  )
      toast.error(
  error.response?.data?.detail ||
  "Complaint submission failed."
)
    } finally {
      setSubmitLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-4">
            AI-Powered Complaint System
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Upload an image of a civic issue and let our AI automatically generate a professional complaint for you.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl border border-slate-200/50 p-8 lg:p-12 space-y-8">
          
          {/* Upload Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-3 tracking-tight">
                📷 Upload Issue Image
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-slate-400 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center gap-4"
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Issue preview"
                      className="w-full max-w-md max-h-80 object-contain rounded-2xl shadow-lg mx-auto"
                    />
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-lg font-medium text-slate-900">Click to upload image</p>
                        <p className="text-sm text-slate-500">PNG, JPG up to 10MB</p>
                      </div>
                    </>
                  )}
                </label>
              </div>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!image || loading}
              className="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white font-semibold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Image...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Analyze with AI
                </>
              )}
            </button>
          </div>

          {/* AI Results Form */}
          {aiResult && (
            <>
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">AI Analysis Complete</h2>
                    <p className="text-slate-600">Review and edit the generated complaint details below</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Complaint Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-lg placeholder-slate-500"
                      placeholder="Enter complaint title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-900 mb-3">
                      Description *
                    </label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-vertical placeholder-slate-500"
                      placeholder="Describe the issue in detail..."
                    />
                  </div>
                  <div>

  <label
    className="
      font-medium
      block
      mb-2
    "
  >

    Address

  </label>

  <input
    type="text"

    placeholder="
      Enter complaint location
    "

    value={formData.address}

    onChange={(e) =>
      setFormData({

        ...formData,

        address:
          e.target.value,
      })
    }

    className="
      w-full
      border
      rounded-xl
      p-3
    "
  />

</div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-900 mb-3">
                        Department
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-slate-500"
                        placeholder="e.g., Public Works, Sanitation"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>

              <button
                onClick={handleSubmitComplaint}
                disabled={
  submitLoading 
}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-5 px-8 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {submitLoading ? (
                  <>
                    <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Submit Official Complaint
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CreateComplaintPage

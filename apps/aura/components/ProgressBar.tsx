interface IProps {
  progress: number
}

const ProgressBar = ({ progress }: IProps) => (
  <div className='relative py-1'>
    <div className='overflow-hidden h-2 text-xs flex rounded-sm bg-purple-200'>
      <div
        style={{ width: `${progress}%` }}
        className={`
        h-full ${progress < 70 ? 'bg-purple-600' : 'bg-purple-900'}`}
      ></div>
    </div>
  </div>
)

export default ProgressBar

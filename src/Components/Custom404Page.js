import cover_photo from '../Logo/cover_photo.png'

export function Custom404Page() {
    return (
      <div className="page404">
        <img src={cover_photo} alt="triviahack logo"/>
        <h3>404 - this route doesn't exist</h3>
      </div>
    );
  }
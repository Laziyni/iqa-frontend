import { Viewer } from '@toast-ui/react-editor';
import { useAuth } from 'common/context/Auth/useAuth';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import React from 'react';
import dayjs from 'dayjs';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { selectProfile } from 'features/profile/profileSlice';
import { CommentsActions } from './comment-actions/CommentsActions';
import { likeCommentById, unlikeCommentById } from './commentsSlice';

const StyledWrapper = styled.div`
  background-color: #f5f5f5;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 25px;
  & > div {
    margin-bottom: 0 !important;
  }
`;

const StyledProfile = styled.div`
  display: flex;
  align-items: center;
  & > img {
    width: 36px;
    height: 36px;
    border-radius: 24px;
    margin-right: 10px;
  }
`;

const StyledCommentLikes = styled.div`
  display: flex;
  align-items: center;

  & > button {
    border: none;
    background: none;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  & > span {
    margin-left: 0.3125rem;
    color: #ff4646;
    font-weight: 400;
    font-size: 0.875rem;
  }
`;

const StyledTime = styled.span`
  padding-left: 1rem;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray.main};

  &::before {
    content: '•';
    padding-right: 1rem;
  }
`;

const StyledCommentActions = styled.div`
  display: flex;
`;

export const CommentView = ({ comment, lastComment }) => {
  const Wrapper = lastComment ? StyledWrapper : React.Fragment;

  const dispatch = useDispatch();
  const { token } = useAuth();

  const { REACT_APP_FEATURE_LIKE_COMMENT } = process.env;

  const profile = useSelector(selectProfile);
  const commentLikes = comment.likes || 0;
  const commentId = comment._id;
  const userId = profile._id;

  const handleToggleLike = () => {
    if (!commentLikes.includes(userId)) {
      dispatch(likeCommentById({ commentId, userId }));
    } else {
      dispatch(unlikeCommentById({ commentId, userId }));
    }
  };

  return (
    <Wrapper>
      <div className="row align-items mb-4 g-1">
        <div className="col-auto">
          <StyledProfile>
            <img src={comment.author?.avatar?.thumbnail} alt="" />
          </StyledProfile>
        </div>
        <div className="col">
          <div className="d-flex align-items-center">
            <span>{comment.author?.name}</span>
            <StyledTime>{dayjs(comment.createdAt).fromNow()}</StyledTime>
          </div>
          <Viewer theme="iqa" initialValue={comment.text} />
          {!lastComment && (
            <StyledCommentActions>
              <CommentsActions commentId={comment._id} />
              {REACT_APP_FEATURE_LIKE_COMMENT && (
                <StyledCommentLikes>
                  <button
                    className="d-flex align-items-center"
                    type="button"
                    onClick={handleToggleLike}
                    disabled={!token}
                  >
                    {commentLikes.includes(userId) ? (
                      <HeartFilled style={{ color: '#FF4646' }} />
                    ) : (
                      <HeartOutlined style={{ color: '#FF4646' }} />
                    )}
                  </button>
                  <span>{commentLikes.length}</span>
                </StyledCommentLikes>
              )}
            </StyledCommentActions>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

CommentView.propTypes = {
  comment: PropTypes.shape({
    author: PropTypes.shape({
      avatar: PropTypes.shape({
        full: PropTypes.string,
        thumbnail: PropTypes.string,
      }),
      avatarUrl: PropTypes.string,
      name: PropTypes.string,
      _id: PropTypes.string,
    }),
    createdAt: PropTypes.string,
    questionId: PropTypes.string,
    text: PropTypes.string,
    likes: PropTypes.arrayOf(PropTypes.string),
    updatedAt: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  lastComment: PropTypes.bool,
};

CommentView.defaultProps = {
  lastComment: false,
};

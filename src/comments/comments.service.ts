import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from '../posts/post.entity';
import { User } from '../users/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepo: Repository<Comment>,
    @InjectRepository(Post)
    private postsRepo: Repository<Post>,
  ) {}

  async create(postId: number, dto: CreateCommentDto, user: User): Promise<Comment> {
    const post = await this.postsRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException('게시글이 존재하지 않습니다.');

    const comment = this.commentsRepo.create({
      content: dto.content,
      post,
      author: user,
    });
    return this.commentsRepo.save(comment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepo.find({
      where: { post: { id: postId } },
      order: { createdAt: 'ASC' },
    });
  }
}